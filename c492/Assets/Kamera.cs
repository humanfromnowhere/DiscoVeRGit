using UnityEngine;

public class Kamera : MonoBehaviour
{
    public Transform hedef; // Kameranın etrafında döneceği nokta (Evimiz)
    public float donusHizi = 5.0f;
    public float yakinlasmaHizi = 5.0f;
    
    // Kameranın ne kadar yaklaşabileceği sınırları
    public float minMesafe = 2.0f;
    public float maxMesafe = 20.0f;

    private float mesafe = 10.0f;
    private float x = 0.0f;
    private float y = 0.0f;

    void Start()
    {
        // Başlangıç açısını mevcut kameradan al
        Vector3 angles = transform.eulerAngles;
        x = angles.y;
        y = angles.x;

        // Başlangıçta biraz geride dur
        mesafe = 10.0f;
    }

    void LateUpdate()
    {
        // Mouse Sol Tık Basılıysa Döndür
        if (Input.GetMouseButton(0))
        {
            x += Input.GetAxis("Mouse X") * donusHizi;
            y -= Input.GetAxis("Mouse Y") * donusHizi;

            // Kameranın takla atmasını engelle (Y eksenini sınırla)
            y = Mathf.Clamp(y, -20, 80);
        }

        // Mouse Tekerleği ile Zoom Yap
        mesafe -= Input.GetAxis("Mouse ScrollWheel") * yakinlasmaHizi;
        mesafe = Mathf.Clamp(mesafe, minMesafe, maxMesafe);

        // Hesaplamalar (Matematik kısmı)
        Quaternion rotation = Quaternion.Euler(y, x, 0);
        
        // Kamera merkezin (0,0,0) etrafında dönsün
        Vector3 merkez = Vector3.zero; 
        if (hedef != null) merkez = hedef.position;

        Vector3 position = rotation * new Vector3(0.0f, 0.0f, -mesafe) + merkez;

        transform.rotation = rotation;
        transform.position = position;
    }
}