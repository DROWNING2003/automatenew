// In MyModal.tsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { createCourse } from "../Api";

interface MyModalProps {
  show: boolean;
  handleClose: () => void;
}

const MyModal: React.FC<MyModalProps> = ({ show, handleClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = async () => {
    try {
        const response = await createCourse({
          description,
          git_url: repoLink,
          tag,
          title,
        });
        console.log("API response:", response);
        // Close modal after submit
        handleClose();
        // Optionally reset form
        setTitle("");
        setDescription("");
        setRepoLink("");
        setTag("");
      } catch (error) {
        console.error("Error creating course:", error);
        // Optionally show error feedback to user here
      }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Class</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Title
        <div className="input-group mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        Description
        <div className="input-group mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        GitHub Repo Link
        <div className="input-group mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. https://github.com/username/repo.git"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
          />
        </div>
        Tag
        <div className="input-group mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 编程语言"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
