import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody,
  CardTitle, CardText, Spinner, Button, Input, FormGroup, Label
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const CRUDlaporan = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/articles")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const processedData = Array.isArray(data) ? data : [data];
        const articlesWithImages = processedData.map((article) => ({
          ...article,
          thumbnail: article.thumbnail
            ? article.thumbnail.startsWith("http")
              ? article.thumbnail
              : `http://localhost:5000${article.thumbnail}`
            : null,
        }));
        setArticles(articlesWithImages);
        setFilteredArticles(articlesWithImages);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setArticles([]);
        setFilteredArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter berdasarkan lokasi dan status
  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== "all" && selectedCategory !== "") {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (selectedStatus !== "all" && selectedStatus !== "") {
      filtered = filtered.filter((article) => article.status === selectedStatus);
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, selectedStatus, articles]);

  const handleDone = async (id) => {
    if (!window.confirm("Tandai artikel ini sebagai selesai (done)?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}/ditemukan`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Gagal menandai artikel sebagai done");
      alert("Artikel berhasil ditandai sebagai done!");
      // refresh data
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "ditemukan" } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update artikel");
    }
  };

  const handleUpdate = (id) => navigate(`/update/${id}`);
  const handleDetail = (id) => navigate(`/article/${id}`);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4 shadow-md p-3 mb-5 bg-white rounded">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <Button color="success" href="/">Kembali</Button>

        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* Filter Lokasi */}
          <FormGroup className="mb-0 d-flex align-items-center">
            <Label for="categoryFilter" className="me-2 fw-bold">
              Lokasi Ditemukan:
            </Label>
            <Input
              id="categoryFilter"
              type="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Semua Lokasi</option>
              <option value="Gedung Lama">Gedung Lama</option>
              <option value="Instalasi Gawat Darurat">Instalasi Gawat Darurat</option>
              <option value="Abhipraya">Abhipraya</option>
              <option value="Abhinaya">Abhinaya</option>
              <option value="Abyakta">Abyakta</option>
            </Input>
          </FormGroup>

          {/* Filter Status */}
          <FormGroup className="mb-0 d-flex align-items-center">
            <Label for="statusFilter" className="me-2 fw-bold">
              Status:
            </Label>
            <Input
              id="statusFilter"
              type="select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="diamankan">Diamankan Di Pos</option>
              <option value="dicari">Pencarian</option>
              <option value="ditemukan">Ditemukan</option>
              
              <option value="hilang">Hilang</option>
              
            </Input>
          </FormGroup>
        </div>
      </div>

      <Row>
        <div>
          <h3 style={{ marginBottom: "30px" }}>Klik laporan untuk preview</h3>
        </div>

        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Col md="4" key={article.id || article._id} className="mb-4">
              <Card
                className="shadow-sm h-100 border-0 rounded hover-shadow"
                style={{ cursor: "pointer", transition: "0.3s" }}
                onClick={() => handleDetail(article.id)}
              >
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                ) : (
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center"
                    style={{
                      height: "200px",
                      backgroundColor: "#f8f9fa",
                      color: "#6c757d",
                    }}
                  >
                    No Image Available
                  </div>
                )}
                <CardBody>
                  <CardTitle tag="h5" className="mb-2">
                    {article.title}
                  </CardTitle>
                  <p className="text-muted mb-2">
                    {article.category} • <strong>{article.status}</strong>
                  </p>
                  <CardText style={{ fontSize: "0.9rem", minHeight: "60px" }}>
                    {article.content && article.content.length > 100
                      ? article.content.substring(0, 100) + "..."
                      : article.content}
                  </CardText>

                  <div
                    className="d-flex justify-content-between mt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      color="warning"
                      size="md"
                      onClick={() => handleUpdate(article.id)}
                    >
                      Update
                    </Button>
                    <Button
                      color="success"
                      size="md"
                      onClick={() => handleDone(article.id)}
                    >
                      Done
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center py-4">
              <p>Tidak ada artikel untuk filter ini.</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CRUDlaporan;
