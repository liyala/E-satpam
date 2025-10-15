// UpdatePage.jsx
import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody,
  CardTitle, Form, FormGroup, Label, Input,
  Button, Alert, Spinner
} from "reactstrap";
import { useParams, useNavigate, data } from "react-router-dom";

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    thumbnail: null
  });

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/articles/${id}`);
      
      if (!response.ok) {
        throw new Error('Artikel tidak ditemukan');
      }
      
      const data = await response.json();
      setArticle(data);
      setFormData({
        title: data.title || "",
        content: data.content || "",
        category: data.category || "",
        thumbnail: null
      });
    } catch (err) {
      setError("Gagal memuat artikel: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      thumbnail: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'PUT',
        body: formDataToSend,
         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengupdate artikel');
      }

      setSuccess("Artikel berhasil diupdate!");
      setTimeout(() => {
        navigate("/kelola-laporan"); // Kembali ke halaman list
      }, 2500);

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/kelola-laporan");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
        <span className="ms-2">Memuat data artikel...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          <h4>Artikel tidak ditemukan</h4>
          <p>Artikel yang ingin diupdate tidak dapat ditemukan.</p>
          <Button color="primary" onClick={() => navigate("/berita")}>
            Kembali ke Daftar Artikel
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card className="shadow">
            <CardBody>
              <CardTitle tag="h3" className="text-center mb-4">
                Update Artikel
              </CardTitle>

              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="title">Judul Artikel</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan judul artikel"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="category">Kategori</Label>
                  <Input
                    type="text"
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan kategori"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="content">Konten Artikel</Label>
                  <Input
                    type="textarea"
                    name="content"
                    id="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Tulis konten artikel di sini..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="thumbnail">Gambar Thumbnail (Opsional)</Label>
                  <Input
                    type="file"
                    name="thumbnail"
                    id="thumbnail"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <small className="text-muted">
                    Biarkan kosong jika tidak ingin mengubah gambar
                  </small>
                </FormGroup>

                {article.thumbnail && (
                  <FormGroup>
                    <Label>Gambar Saat Ini:</Label>
                    <div>
                      <img 
                        src={article.thumbnail} 
                        alt="gambar sekarang" 
                        style={{ maxWidth: "200px", maxHeight: "150px" }}
                        className="img-thumbnail"
                      />
                    </div>
                  </FormGroup>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    color="secondary" 
                    onClick={handleCancel}
                    disabled={updating}
                  >
                    Batal
                  </Button>
                  
                  <Button 
                    color="success" 
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Mengupdate...
                      </>
                    ) : (
                      "Update Artikel"
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePage;