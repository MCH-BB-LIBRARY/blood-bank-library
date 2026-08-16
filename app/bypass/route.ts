export default function BypassPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Tahoma" }}>
      <h2>تم تجهيز جلسة الدخول بنجاح!</h2>
      <br />
      <a 
        href="/admin" 
        style={{ 
          padding: "15px 30px", 
          backgroundColor: "#0070f3", 
          color: "#fff", 
          textDecoration: "none", 
          borderRadius: "8px",
          fontSize: "18px"
        }}
      >
        اضغط هنا للدخول إلى لوحة التحكم فوراً
      </a>
    </div>
  );
}
