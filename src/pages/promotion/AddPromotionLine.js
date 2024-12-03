import React, { useState, useEffect } from "react";
import "./Promotion.scss";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Select from "react-select"; // Import React Select
import { addPromotionLine } from "../../services/promotionRequest";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";
import { validatePromotionLineData } from "../../utils/validation";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function AddPromotionLine({ isOpen, onClose, promotionHeader }) {
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const [minStartDate, setMinStartDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const today = format(new Date(), "yyyy-MM-dd");
  const [promotionLineData, setPromotionLineData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    type: "", // Default value as a string
    status: 'inactive', // Default value as a string
    promotionHeader_id: promotionHeader._id,
  });

  useEffect(() => {
    const startDate = new Date(promotionHeader.startDate);
    const minStart =
      startDate < new Date(today) ? today : format(startDate, "yyyy-MM-dd");
    setMinStartDate(minStart);

    setPromotionLineData((prev) => ({
      ...prev,
      startDate: minStart,
      endDate: format(new Date(promotionHeader.endDate), "yyyy-MM-dd"), // Set endDate from promotionHeader
    }));
  }, [promotionHeader, today]);

  // Update the handleChange to set the string value, not the entire object
  const handleChange = (selectedOption, action) => {
    const { name } = action;
    setPromotionLineData((prevData) => ({
      ...prevData,
      [name]: selectedOption.value,
    })); // Store only the string value
  };

  const handleAddPromotionLine = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validatePromotionLineData(promotionLineData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      toast.error(errors);
      return;
    }

    try {
      const response = await addPromotionLine(
        promotionLineData,
        dispatch,
        accessToken,
        axiosJWT
      );
      if (response) {
        setPromotionLineData({
          description: "",
          startDate: minStartDate, // Reset startDate to minStartDate
          endDate: "",
          type: "percentage", // Reset to default value
          status: 'inactive', // Reset to default value
          promotionHeader_id: promotionHeader._id,
        });
        setErrors({});
        setLoading(false);
        toast.success("Đã thêm dòng khuyến mãi thành công");
        onClose()
      }
    } catch (error) {
      console.error("Failed to add promotion line:", error);
      toast.error("Có lỗi xảy ra khi thêm dòng khuyến mãi");
    }
  };

  const typeOptions = [
    { value: "percentage", label: "Phần trăm" },
    { value: "amount", label: "Số tiền" },
    { value: "quantity", label: "Số lượng" },
  ];

  return (
    <Modal
      title={`${promotionHeader.description}`}
      isOpen={isOpen}
      onClose={onClose}
      width={"30%"}
    >
      <div className="flex-column-center">
        <form onSubmit={handleAddPromotionLine}>
          <Input
            label="Mô tả dòng khuyến mãi"
            placeholder="Nhập mô tả"
            name="description"
            value={promotionLineData.description}
            onChange={(e) =>
              setPromotionLineData({
                ...promotionLineData,
                description: e.target.value,
              })
            }
            error={errors.description}
          />

          <Input
            type="date"
            label="Ngày bắt đầu"
            name="startDate"
            value={promotionLineData.startDate}
            onChange={(e) =>
              setPromotionLineData({
                ...promotionLineData,
                startDate: e.target.value,
              })
            }
            error={errors.startDate}
            min={minStartDate}
            max={new Date(promotionHeader.endDate).toISOString().slice(0, 10)}
          />

          <Input
            type="date"
            label="Ngày kết thúc"
            name="endDate"
            value={promotionLineData.endDate}
            onChange={(e) =>
              setPromotionLineData({
                ...promotionLineData,
                endDate: e.target.value,
              })
            }
            error={errors.endDate}
            min={promotionLineData.startDate} // Set min based on startDate
            max={new Date(promotionHeader.endDate).toISOString().slice(0, 10)}
          />

          <label htmlFor="type">Loại khuyến mãi:</label>
          <Select
            name="type"
            options={typeOptions}
            value={typeOptions.find(
              (option) => option.value === promotionLineData.type
            )} // Match the string value
            onChange={handleChange}
            classNamePrefix="select"
          />

          <div className="flex-row-center" style={{ paddingTop: 100 }}>
            {loading ? (
              <ClipLoader size={30} color="#2392D0" loading={loading} />
            ) : (
              <div className="login-button" style={{ width: 200 }}>
                <Button type="submit" text="Thêm" disabled={loading} />
              </div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
