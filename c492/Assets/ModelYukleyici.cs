using UnityEngine;
using GLTFast;
using System.Threading.Tasks;

public class SupabaseModelYukleyici : MonoBehaviour
{
    private GameObject mevcutModel;

    // Web sitesindeki butona basınca bu fonksiyon tetiklenecek
    public async void ModelYukle(string modelUrl)
    {
        Debug.Log("Supabase'den yükleniyor: " + modelUrl);

        // 1. Eğer sahnede eski bir model varsa onu temizle
        if (mevcutModel != null)
        {
            Destroy(mevcutModel);
        }

        // 2. Yeni bir obje oluştur ve modeli içine yükle
        mevcutModel = new GameObject("YuklenenModel");
        var gltf = new GltfImport();
        
        // glTFast kütüphanesi ile URL'den yükleme yapıyoruz
        bool success = await gltf.Load(modelUrl);

        if (success)
        {
            // Modeli sahneye ekle
            await gltf.InstantiateMainSceneAsync(mevcutModel.transform);
            
            // 3. Modeli kameranın göreceği yere ortala (isteğe bağlı)
            mevcutModel.transform.position = new Vector3(0, 0, 5); 
            Debug.Log("✅ Model başarıyla sahneye yerleştirildi.");
        }
        else
        {
            Debug.LogError("❌ Model yükleme başarısız oldu!");
        }
    }
}