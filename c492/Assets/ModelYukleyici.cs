using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.IO;
using System.Collections.Generic;
using System.Globalization;

public class ModelYukleyici : MonoBehaviour
{
    [Header("Ayarlar")]
    public Material beyazMateryal; 
    
    // Yüklediğin dosyanın adı
    string dosyaAdi = "bambu.obj"; 
    string sunucuYolu = "http://localhost:3000/uploads/";

    void Start()
    {
        // Sahne karanlıksa diye otomatik ışık ekle
        IsikEkle();
        Debug.Log("Sistem Başladı. " + dosyaAdi + " bekleniyor...");
    }

    // Web sitesi butona basınca burayı çalıştırır
    public void ModelYukle(string gelenIsim)
    {
        // Eğer web sitesinden isim gelmezse varsayılanı (bambsu.obj) kullan
        if (!string.IsNullOrEmpty(gelenIsim)) dosyaAdi = gelenIsim;

        // Eski modeli temizle
        GameObject eski = GameObject.Find("YuklenenModel");
        if (eski != null) Destroy(eski);

        StartCoroutine(IndirVeOlustur(sunucuYolu + dosyaAdi));
    }

    IEnumerator IndirVeOlustur(string url)
    {
        Debug.Log("İndiriliyor: " + url);
        UnityWebRequest www = UnityWebRequest.Get(url);
        yield return www.SendWebRequest();

        if (www.result == UnityWebRequest.Result.Success)
        {
            string veri = www.downloadHandler.text;
            
            // 1. Modeli Yarat
            GameObject model = new GameObject("YuklenenModel");
            MeshFilter filter = model.AddComponent<MeshFilter>();
            MeshRenderer renderer = model.AddComponent<MeshRenderer>();
            
            // Materyali ata
            if(beyazMateryal != null) renderer.material = beyazMateryal;

            // 2. Senin Dosyana Özel Okuyucu (Quad Desteği)
            Mesh mesh = OzelObjOkuyucu(veri);
            
            if (mesh.vertexCount > 0)
            {
                filter.mesh = mesh;
                
                // 3. Konum ve Boyut (Garanti Görünürlük)
                model.transform.position = new Vector3(0, 0, 4); // Kameranın tam önüne
                model.transform.rotation = Quaternion.Euler(0, 45, 0); // Hafif çapraz dursun (3D belli olsun)
                model.transform.localScale = Vector3.one * 1.5f; // Boyutu biraz büyüt
                
                Debug.Log("BAŞARILI! Model sahnede.");
            }
            else
            {
                Debug.LogError("Dosya indi ama içi boş çıktı!");
            }
        }
        else
        {
            Debug.LogError("İndirme Hatası: " + www.error);
        }
    }

    // --- SENİN DOSYAN İÇİN GÜÇLENDİRİLMİŞ OKUYUCU ---
    Mesh OzelObjOkuyucu(string data)
    {
        List<Vector3> v = new List<Vector3>();
        List<int> t = new List<int>();
        CultureInfo ci = CultureInfo.InvariantCulture;

        using (StringReader r = new StringReader(data))
        {
            string l;
            while ((l = r.ReadLine()) != null)
            {
                string[] p = l.Split(new[] { ' ', '\t' }, System.StringSplitOptions.RemoveEmptyEntries);
                if (p.Length < 2) continue;

                // "v" = Noktalar
                if (p[0] == "v") 
                {
                    float x = float.Parse(p[1], ci);
                    float y = float.Parse(p[2], ci);
                    float z = float.Parse(p[3], ci);
                    v.Add(new Vector3(x, y, z));
                }
                // "f" = Yüzeyler (Önemli Kısım!)
                else if (p[0] == "f") 
                {
                    // Yüzeydeki sayıları al (1/1/1 olsa bile sadece baştaki 1'i alır)
                    List<int> indexler = new List<int>();
                    for (int i = 1; i < p.Length; i++)
                    {
                        string[] parca = p[i].Split('/');
                        if (int.TryParse(parca[0], out int idx))
                        {
                            if (idx < 0) idx = v.Count + idx + 1;
                            indexler.Add(idx - 1);
                        }
                    }

                    // Eğer 3 noktalıysa (Üçgen)
                    if (indexler.Count == 3)
                    {
                        t.Add(indexler[0]); t.Add(indexler[1]); t.Add(indexler[2]);
                    }
                    // Eğer 4 noktalıysa (Quad - SENİN DOSYAN BÖYLE)
                    else if (indexler.Count == 4)
                    {
                        // Dörtgeni iki üçgene bölüyoruz: 0-1-2 ve 0-2-3
                        t.Add(indexler[0]); t.Add(indexler[1]); t.Add(indexler[2]);
                        t.Add(indexler[0]); t.Add(indexler[2]); t.Add(indexler[3]);
                    }
                }
            }
        }

        Mesh m = new Mesh();
        m.indexFormat = UnityEngine.Rendering.IndexFormat.UInt32;
        m.vertices = v.ToArray();
        m.triangles = t.ToArray();
        m.RecalculateNormals();
        return m;
    }

    // Sahnede ışık yoksa model siyah görünür, bunu engellemek için kodla ışık yaratıyoruz
    void IsikEkle()
    {
        if (FindObjectOfType<Light>() == null)
        {
            GameObject lightGO = new GameObject("Otomatik Isik");
            Light light = lightGO.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.0f;
            lightGO.transform.rotation = Quaternion.Euler(50, -30, 0);
        }
    }
}