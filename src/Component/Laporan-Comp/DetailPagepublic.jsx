import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody,
  CardTitle, CardText, Spinner, Button, Badge,
  Alert
} from "reactstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";


const DetailPagepublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 404) {
      // kalau artikel tidak ada, langsung kosongkan state
      setArticle(null);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const processedArticle = {
      ...data,
      thumbnail: data.thumbnail
        ? data.thumbnail.startsWith("http")
          ? data.thumbnail
          : `http://localhost:5000${data.thumbnail}`
        : null,
    };

    setArticle(processedArticle);
  } catch (err) {
    console.error("Error fetching article:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    try {
      return format(parseISO(dateString), " dd MMMM yyyy ");
    } catch (err) {
      return dateString;
    }
  };

  const handleEdit = () => {
    navigate(`/update/${id}`);
  };

  const handleBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Spinner color="primary" size="lg" />
        <p className="mt-3">Memuat artikel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <div className="d-flex gap-2 mt-3">
            <Button color="primary" onClick={fetchArticle}>
              Coba Lagi
            </Button>
            <Button color="secondary" onClick={handleBack}>
              Kembali
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="mt-4">
        <Alert color="warning">
          <h4>Artikel Tidak Ditemukan</h4>
          <p>Artikel yang Anda cari tidak tersedia.</p>
          <Button color="primary" onClick={() => navigate("/")}>
            Kembali ke Beranda
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              🏠 Beranda
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Detail Artikel
          </li>
        </ol>
      </nav>

      {/* Article Content */}
      <Row className="justify-content-center">
        <Col lg="8" md="10">
          <Card className="shadow-lg border-0">
            {/* Article Image */}
            {article.thumbnail && (
              <div style={{ maxHeight: "500px", overflow: "hidden" }}>
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="card-img-top"
                  style={{ 
                    width: "100%", 
                    height: "auto", 
                    objectFit: "cover" 
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x400/4a6572/ffffff?text=Gambar+Tidak+Tersedia";
                  }}
                />
              </div>
            )}
            
            <CardBody className="p-4">
              {/* Article Header */}
              <div className="text-center mb-4">
                <CardTitle tag="h1" className="mb-3 fw-bold text-primary">
                  {article.title}
                </CardTitle>
                
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
                  {article.category && (
                    <Badge color="primary" pill className="fs-6 px-3 py-2">
                      📁 {article.category}
                    </Badge>
                  )}
                  
                  {article.created_at && (
                    <Badge color="secondary" pill className="fs-6 px-3 py-2">
                      📅 {formatDate(article.created_at)}
                    </Badge>
                  )}
                  
                  {article.author && (
                    <Badge color="info" pill className="fs-6 px-3 py-2">
                      ✍️ Oleh: {article.author}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <CardText 
                className="article-content fs-5 lh-lg"
                style={{ 
                  whiteSpace: "pre-wrap",
                  textAlign: "justify",
                  lineHeight: "1.8"
                }}
              >
                {article.content}
              </CardText>

              {/* Action Buttons */}
              {/* <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                <Button 
                  color="secondary" 
                  onClick={handleBack}
                  className="d-flex align-items-center"
                >
                  ← Kembali
                </Button>
                
                <div className="d-flex gap-2">
                  <Button 
                    color="warning" 
                    onClick={handleEdit}
                    className="d-flex align-items-center"
                  >
                    ✏️ Edit Artikel
                  </Button>
                  
                  <Button 
                    tag={Link}
                    to="/"
                    color="primary"
                    className="d-flex align-items-center"
                  >
                    📰 Lihat Semua Artikel
                  </Button>
                </div>
              </div> */}
            </CardBody>
          </Card>

          {/* Related Info Section */}
          <Card className="mt-4 border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">📋 Informasi Artikel</h5>
              <Row>
                <Col md="6">
                  <div className="mb-2">
                    <strong>ID Artikel:</strong> {article.id}
                  </div>
                  <div className="mb-2">
                    <strong>Kategori:</strong> {article.category || "Tidak ada kategori"}
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-2">
                    <strong>Tanggal Dibuat:</strong> {formatDate(article.created_at)}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> 
                    <Badge color="success" className="ms-2">
                       Publis
                    </Badge>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailPagepublic;