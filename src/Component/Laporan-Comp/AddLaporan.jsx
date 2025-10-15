import React, { useState } from "react";
import {
  Container,Row,Col,Card,CardBody,CardTitle,
  Form,FormGroup,Label,Input,Button,Alert
} from "reactstrap";

const AddLaporan = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showAlert = (message, color = "success") => {
    setAlertMessage(message);
    setAlertColor(color);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 5000);
  };

  // Handle pilih file
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // langsung preview gambar
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      }

      const response = await fetch("http://localhost:5000/api/articles", {
        method: "POST",
        headers : {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showAlert("Berita berhasil ditambahkan!", "success");
        // Reset form
        setTitle("");
        setContent("");
        setCategory("");
        setSelectedFile(null);
        setPreview(null);
        document.getElementById("thumbnailFile").value = "";
      } else {
        showAlert(`Gagal menambahkan berita: ${data.error}`, "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("Terjadi kesalahan saat menambahkan berita", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setSelectedFile(null);
    setPreview(null);
    document.getElementById("thumbnailFile").value = "";
  };

  return (

    <Container className="mt-4">
      <div>
       <Button style={{marginBottom :"10px"}} 
        color="success" href="/" > Kembali </Button>
      </div>
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card className="shadow-lg">
            <CardBody>
              <CardTitle tag="h2" className="text-center mb-4 text-dark">
                Buat Laporan Barang Ditemukan
              </CardTitle>

              <Alert
                color={alertColor}
                isOpen={alertVisible}
                toggle={() => setAlertVisible(false)}
                className="mt-3"
              >
                {alertMessage}
              </Alert>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="title" className="fw-bold">
                    Judul Laporan *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul berita"
                    required
                    className="py-2"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="content" className="fw-bold">
                    Isi Berita *
                  </Label>
                  <Input
                    id="content"
                    type="textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tulis isi berita di sini..."
                    rows="8"
                    required
                    className="py-2"
                    style={{ resize: "vertical" }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="thumbnailFile" className="fw-bold">
                    Foto Barang 
                  </Label>
                  <Input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="py-2"
                  />
                  <small className="text-muted">
                    Format: JPG, PNG, GIF (Maksimal 4MB)
                  </small>
                </FormGroup>

                {/* Preview Gambar */}
                {preview && (
                  <FormGroup>
                    <Label className="fw-bold">Preview Foto</Label>
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px", maxWidth: "100%"}}
                      />
                    </div>
                  </FormGroup>
                )}

                <FormGroup>
                  <Label for="category" className="fw-bold">
                    Lokasi Ditemukan
                  </Label>
                  <Input
                    id="category"
                    type="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="py-2"
                  >

                  <option value="">Pilih Lokasi</option>
                  <option value="Gedung Lama">Gedung Lama</option>
                  <option value="Instalasi Gawat Darurat">Instalasi Gawat Darurat</option>
                  <option value="Abhipraya">Abhipraya</option>
                  <option value="Abhinaya">Abhinaya</option>
                  <option value="Abyakta">Abyakta</option>
                    {/* <option value="">Pilih Kategori</option>
                    <option value="Politik">Politik</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Laporan">Laporan khusus </option>
                    <option value="Public">Public</option>
                    <option value="Hiburan">Hiburan</option>
                    <option value="Kehilangan">Kehilangan</option>
                    <option value="Pencarian">Di Cari</option> */}
                  </Input>
                </FormGroup>

                <div className="d-grid gap-2 mt-4">
                  <Button
                    color="success"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Berita"}
                  </Button>

                  <Button
                    color="secondary"
                    outline
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset Form
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

export default AddLaporan;
