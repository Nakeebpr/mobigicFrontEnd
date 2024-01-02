import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-loading-skeleton/dist/skeleton.css";
import OtpInput from "react-otp-input";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { get, post } from "../services/apiServices";
import { Pagination } from "@mui/material";

const style = {
  position: "absolute",
  borderRadius: 15,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function MangeImages() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoListLoading, setIsPhotoListLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [thumbnailUploaded, setThumbnailUploaded] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 576);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPagesCount, setTotalpageCount] = useState("");

  const [deleteId, setDeleteId] = useState("");
  const [downloadId, setDownloadId] = useState("");

  // manage modal for delete start
  const [open, setOpen] = React.useState(false);
  const handleOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  // manage modal for delete end

  // manage modal for update start
  const [otp, setOtp] = useState("");
  const [openDownload, setOpenDownload] = React.useState(false);
  const handleDownload = (id) => {
    setDownloadId(id);
    setOpenDownload(true);
  };
  const handleCloseDownload = () => {
    setOpenDownload(false);
    setOtp("");
  };
  // manage modal for update end

  const fileInputRef = useRef(null);

  // upload image start
  const [imagePath, setImagePath] = useState("");
  const uploadImage = async (e) => {
    try {
      setThumbnailUploaded(false);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      setIsLoadingImages(true);
      const response = await post(`/upload_image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImagePath(response?.data?.path);
      setThumbnailUploaded(true);
      setIsLoadingImages(false);
    } catch (error) {
      setIsLoadingImages(false);
    }
  };
  // upload image end

  // to expand description start
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const toggleDescription = (rowId) => {
    setShowFullDescription(!showFullDescription);
    setSelectedRowId(rowId);
  };
  // to expand description end

  //   for add image start
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      fileName: "",
    },

    validationSchema: Yup.object({
      fileName: Yup.string()
        .min(2, "Please Enter Atleast 2 Characters ")
        .required("Please Enter File Name"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = {
          imageTitle: values.fileName,
          imagePath: imagePath,
        };

        if (thumbnailUploaded == false) {
          toast.error("Please select thumbnail to upload");
        } else {
          setIsLoading(true);
          const response = await post(`/save_image`, data);
          setIsLoading(false);
          // updateData();
          setRenderEdit(!renderEdit);

          if (response && response?.status == 200) {
            resetForm();
            setImagePath("");
            setThumbnailUploaded(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  const [photoList, setPhotoList] = useState([]);

  // for pagination start

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  // for pagination end

  const getPhotos = async () => {
    try {
      setIsPhotoListLoading(true);
      const response = await get(
        `/getPhotos?page=${page}&itemsPerPage=${itemsPerPage}`
      );
      setIsPhotoListLoading(false);
      setTotalpageCount(response?.data?.totalPagesCount);
      setPhotoList(response?.data?.message);
    } catch (error) {
      setIsPhotoListLoading(false);
    }
  };

  useEffect(() => {
    getPhotos();
  }, [renderEdit, page, itemsPerPage]);

  const deleteImage = async (id) => {
    try {
      setIsDeleting(true);
      const data = {
        id: deleteId,
      };
      const response = await post("/deleteImage", data);
      setIsDeleting(false);
      setRenderEdit(!renderEdit);
      handleClose();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const downLoadImage = async (id) => {
    try {
      if (otp.length == 6) {
        setIsDeleting(true);
        const data = {
          id: downloadId,
          otp: otp,
        };
        const response = await post("/downloadImage", data);
        setIsDeleting(false);
        handleCloseDownload();
        setOtp("");
      } else {
        toast.error("Fill OTP");
      }
    } catch (error) {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 576);
    };

    // Attach the event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="mx-3 mt-3 bgColor">
        <form
          className="needs-validation mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="row px-3 py-3">
            <div className="col-12 col-md-4">
              <lable className="form-label">
                <h4>Image Title</h4>
              </lable>
              <input
                name="fileName"
                className="form-control lable-margin referral-input1 center_button inputFocus"
                placeholder="Please Enter Image Title"
                type="text"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.fileName}
              />
              {validation.touched.fileName && validation.errors.fileName ? (
                <span className="error">{validation.errors.fileName}</span>
              ) : null}
            </div>
            <div className="col-12 col-md-6">
              <lable className="form-label">
                <h4>Select File</h4>
              </lable>
              <input
                name="image"
                className="form-control lable-margin referral-input1 inputFocus"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={uploadImage}
                disabled={isLoadingImages || isLoading}
              />
              {imagePath && (
                <img
                  src={imagePath}
                  alt=""
                  width={"100px"}
                  height={"100px"}
                  className="mx-1"
                />
              )}
            </div>

            <div className="col-12 col-md-2" style={{ paddingTop: "38px" }}>
              <button
                type="submit"
                className={`btn btn-dark px-2 form-control button ${
                  isLargeScreen ? "btnPadding" : "btnPaddingStudent"
                }`}
                disabled={isLoading || isLoadingImages}
              >
                {isLoadingImages
                  ? "Uploading..."
                  : isLoading
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mx-3 mt-3 bgColor">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                Sr No
              </th>
              <th scope="col" className="text-center">
                Title
              </th>
              <th scope="col" className="text-center">
                Image
              </th>
              <th scope="col" className="text-center">
                Action
              </th>
            </tr>
          </thead>

          {isPhotoListLoading ? (
            <>
              <tbody>
                <tr>
                  <td colSpan="4">
                    <SkeletonTheme baseColor="#3498db" highlightColor="#ffffff">
                      <p>
                        <Skeleton count={10} height={50} />
                      </p>
                    </SkeletonTheme>
                  </td>
                </tr>
              </tbody>
            </>
          ) : photoList && photoList.length > 0 ? (
            photoList.map((item, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <td scope="row" className="text-center align-middle">
                      {index + 1 + (page - 1) * itemsPerPage}
                    </td>
                    <td className="text-center align-middle">
                      {item?.imageTitle}
                    </td>
                    <td className="justify-content-center align-middle text-center">
                      <img
                        className="imageListHeight text-center"
                        src={item?.imagePath}
                        alt=""
                      />
                    </td>
                    <td
                      className="text-center align-middle d-flex"
                      style={{ justifyContent: "center" }}
                    >
                      <div
                        onClick={() => handleDownload(item?._id)}
                        className="actionButton"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="16"
                          viewBox="0 0 512 512"
                        >
                          <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                        </svg>
                      </div>
                      <div
                        onClick={() => handleOpen(item?._id)}
                        className="actionButton"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="14"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <tbody>
              <tr>
                <th scope="row" colSpan={4} className="text-center">
                  No Data Available
                </th>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="d-flex justify-content-between mt-3 mx-3">
        <Pagination
          count={totalPagesCount}
          page={page}
          onChange={handleChange}
          color="primary"
          shape="rounded"
        />
        <div>
          <span className="mx-2">Select</span>
          <select
            id="itemsPerPage"
            className="inputFocus"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="mx-2">Items</span>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="popUpModal"
      >
        <Box sx={style} className="popUpModal">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="p"
            className="text-center"
          >
            Delete Record?
          </Typography>
          <div className="d-flex justify-content-center">
            <button
              className="py-1 mx-3 btn btn-primary button"
              type="button"
              onClick={deleteImage}
            >
              {isDeleting ? "Deleting" : "Yes"}
            </button>
            <button
              className=" py-1 mx-3 btn btn-danger button_danger button"
              type="button"
              onClick={handleClose}
            >
              No
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openDownload}
        onClose={handleCloseDownload}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="popUpModal"
      >
        <Box sx={style} className="popUpModal">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="p"
            className="text-center"
          >
            Enter PIN to download...
          </Typography>
          <div className="d-flex otp-input-fields justify-content-center py-3">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <div className="d-flex justify-content-center">
            <div>
              <button
                className="py-1 mx-3 btn btn-primary button"
                type="button"
                onClick={downLoadImage}
              >
                {isDeleting ? "Downloading..." : "Download"}
              </button>
              <button
                className=" py-1 mx-3 btn btn-danger button_danger button"
                type="button"
                onClick={handleCloseDownload}
              >
                Cancel
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default MangeImages;
