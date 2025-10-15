import React, { useEffect, useState } from "react";
import {
  Container,Row,Col,Card,CardBody,
  CardTitle,CardText,Spinner,Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const ListLaporanpublic = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/api/articles")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
  const processedData = Array.isArray(data) ? data : [data];

  const articlesWithImages = processedData
    // hanya ambil artikel yang category-nya tidak sama dengan "laporan"
    .filter((article) => article.category?.toLowerCase() !== "laporan")
    .map((article) => ({
      ...article,
      thumbnail: article.thumbnail
        ? article.thumbnail.startsWith("http")
          ? article.thumbnail
          : `http://localhost:5000${article.thumbnail}`
        : null,
    }));

  setArticles(articlesWithImages);
})

      .catch((err) => {
        console.error("Error fetching articles:", err);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  

  const handleDetail = (id) => {
    navigate(`/article/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
      </div>
    );
  }
  

  return (
    <Container className="mt-4">
      <div>
        <Button style={{marginBottom :"10px"}} 
        color="success" href="/" > Kembali </Button>
      </div>
      <Row>
        {articles.length > 0 ? (
          articles.map((article) => (
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
                  <p className="text-muted mb-2">{article.category}</p>
                  <CardText style={{ fontSize: "0.9rem", minHeight: "60px" }}>
                    {article.content && article.content.length > 100
                      ? article.content.substring(0, 100) + "..."
                      : article.content}
                  </CardText>

                  {/* Tombol jangan ikut klik card */}
                  <div
                    className="d-flex justify-content-between mt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center py-4">
              <p>No articles found.</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ListLaporanpublic;
