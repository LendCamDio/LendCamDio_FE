const StudioBooking = () => {
  const studios = [
    {
      id: 1,
      name: "Studio A",
      description: `
Studio hiện đại với không gian rộng rãi 80m², ánh sáng tự nhiên tuyệt vời từ cửa sổ lớn. Phù hợp cho chụp ảnh thời trang, portrait, concept hiện đại.`,
      image:
        "https://img5.thuthuatphanmem.vn/uploads/2021/11/20/anh-cute-nguoi-that-dep-nhat_022606213.jpg",
      convenients: [
        "Tường trắng seamless",
        "Sàn trắng phản quang",
        "Hệ thống đèn softbox",
        "Bàn trang điểm",
      ],
      price: "300000 đ/ngày",
    },
    {
      id: 2,
      name: "Studio B",
      description: `
Studio phong cách vintage với diện tích 70m², trang trí bằng đồ nội thất cổ điển và ánh sáng ấm áp. Phù hợp cho chụp ảnh retro, concept hoài cổ.`,
      image:
        "https://img5.thuthuatphanmem.vn/uploads/2021/11/20/anh-cute-nguoi-that-dep-nhat_022606213.jpg",
      convenients: [
        "Nền gạch cổ",
        "Đèn vàng tạo hiệu ứng hoài cổ",
        "Đồ nội thất vintage",
        "Gương lớn",
      ],
      price: "250000 đ/ngày",
    },
    {
      id: 3,
      name: "Studio C",
      description: `
Studio hiện đại với diện tích 90m², thiết kế tối giản và ánh sáng tự nhiên. Phù hợp cho chụp ảnh sản phẩm, concept hiện đại.`,
      image:
        "https://img5.thuthuatphanmem.vn/uploads/2021/11/20/anh-cute-nguoi-that-dep-nhat_022606213.jpg",
      convenients: [
        "Tường trắng seamless",
        "Sàn gỗ tự nhiên",
        "Hệ thống đèn LED",
        "Bàn trang điểm",
      ],
      price: "350000 đ/ngày",
    },
  ];

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="text-center">
            <h1>Đặt lịch Studio</h1>
            <p>Chọn studio phù hợp cho buổi chụp ảnh của bạn</p>
          </div>
        </div>
      </section>
      {/* Studio List */}
      <section className="section">
        <div className="container">
          <div className="row">
            {studios.map((studio) => (
              <div className="col-md-6 mb-4" key={studio.id}>
                <div className="card-outstanding">
                  <img
                    src={studio.image}
                    className="card-outstanding-img-top"
                    alt={studio.name}
                  />
                  <div className="card-outstanding-body">
                    <h5 className="card-title">{studio.name}</h5>
                    <p className="card-text">{studio.description}</p>
                    <div className="card-convenients">
                      <h6 className="font-semibold">Tiện nghi:</h6>
                      {studio.convenients.map((item, index) => (
                        <ul key={index} className="convenient-item">
                          <li>{item}</li>
                        </ul>
                      ))}
                    </div>
                    <p className="price">{studio.price}</p>
                    <a
                      href={`/studios/${studio.id}`}
                      className="btn-primary book-btn"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudioBooking;
