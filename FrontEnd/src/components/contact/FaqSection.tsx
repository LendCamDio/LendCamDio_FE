import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

const FaqSection = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeInOut,
      },
    },
  };

  const faqs = [
    {
      question: "Làm sao để đặt lịch studio?",
      answer:
        "Bạn có thể đặt lịch trực tuyến qua website, gọi điện hotline hoặc đến trực tiếp cửa hàng. Chúng tôi sẽ xác nhận booking trong vòng 30 phút.",
    },
    {
      question: "Cần đặt cọc bao nhiều?",
      answer:
        "Bạn cần đặt cọc 30% tổng giá trị để giữ lịch. Phần còn lại thanh toán khi sử dụng dịch vụ.",
    },
    {
      question: "Có thể hủy booking không?",
      answer:
        "Có thể hủy booking trước 24h mà không mất phí. Hủy trong vòng 24h sẽ mất 50% tiền cọc.",
    },
    {
      question: "Thiết bị có được bảo hành không?",
      answer:
        "Tất cả thiết bị cho thuê đều được kiểm tra kỹ lưỡng trước khi giao và có bảo hành trong suốt thời gian thuê.",
    },
    {
      question: "Có hỗ trợ kỹ thuật không?",
      answer:
        "Chúng tôi có đội ngũ kỹ thuật hỗ trợ 24/7. Bạn có thể gọi hotline hoặc chat trực tuyến để được hỗ trợ.",
    },
    {
      question: "Có dịch vụ giao hàng không?",
      answer:
        "Có, chúng tôi giao hàng trong phạm vi 20km từ cửa hàng với phí giao hàng từ 50.000đ tùy khoảng cách.",
    },
  ];
  return (
    <section className="section">
      <div className="container h-fit">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-[var(--text-dark)] mb-10"
        >
          Câu hỏi thường gặp
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg"
            >
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                transition={{ duration: 0.2 }}
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors"
              >
                <h5 className="text-lg font-semibold text-[var(--text-dark)]">
                  {faq.question}
                </h5>
                <motion.div
                  animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon
                    icon={expandedFaq === index ? faChevronUp : faChevronDown}
                    className="text-[var(--primary-color)]"
                  />
                </motion.div>
              </motion.button>
              <AnimatePresence initial={false}>
                {expandedFaq === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.4, ease: "easeInOut" },
                        opacity: { duration: 0.3, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="px-6 pb-4 pt-2"
                    >
                      <p className="text-[var(--text-light)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
