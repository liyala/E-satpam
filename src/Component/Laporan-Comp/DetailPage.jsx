import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardBody, CardTitle, Spinner, Button, Badge, Alert } from "reactstrap";
import { useAuth } from "../../context/AuthContext"; // pastikan sudah ada

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // akses data user & role
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}`);
      if (!res.ok) throw new Error("Gagal memuat artikel");
      const data = await res.json();
      setArticle(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi menandai artikel sebagai selesai (done)
  const handleDone = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/articles/${id}/done`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal memperbarui status artikel");
      setArticle((prev) => ({ ...prev, status: "done" }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // 🗑️ Fungsi hapus artikel (hanya admin)
  const handleDelete = async () => {
    const konfirmasi = window.confirm("Apakah kamu yakin ingin menghapus artikel ini?");
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menghapus artikel");
      }

      alert("Artikel berhasil dihapus!");
      navigate("/kelola-laporan"); // kembali ke halaman daftar
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
        <span className="ms-2">Memuat artikel...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <Container className="mt-4">
        <Alert color="danger">{error || "Artikel tidak ditemukan"}</Alert>
        <Button color="secondary" onClick={() => navigate("/")}>
          Kembali
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <CardBody>
          <CardTitle tag="h3" className="mb-3 text-center">
            {article.title}
          </CardTitle>

          {article.thumbnail && (
            <div className="text-center mb-4 justify-content-center">
              <img
                src={article.thumbnail}
                alt="Thumbnail"
                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
              />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge color={article.status === "done" ? "success" : "warning"}>
              {article.status || "Belum ada status"}
            </Badge>
            <small className="text-muted">
              <strong>Kategori:</strong> {article.category || "-"}
            </small>
          </div>

          <p className="mt-3">{article.content}</p>

          <div className="d-flex justify-content-between mt-4">
            <Button color="secondary" onClick={() => navigate("/kelola-laporan")}>
              Kembali
            </Button>

            <div>
              {/* Tombol Done (jika belum done) */}
              {article.status !== "ditemukan" && (
                <Button color="success" onClick={handleDone} disabled={updating} className="me-2">
                  {updating ? "Memproses..." : "Tandai Done"}
                </Button>
              )}

              {/* Tombol Hapus hanya muncul untuk admin */}
              {user?.role === "admin" && (
                <Button color="danger" onClick={handleDelete}>
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default DetailPage;
