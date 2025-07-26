import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditorComponent from "../components/editor";
import TerminalComponent from "../components/terminal";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Markdown } from '@ant-design/pro-editor';
import { Highlight } from '@ant-design/pro-editor';
import remarkGfm from "remark-gfm"; // For tables, strikethroughs, etc.
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import "highlight.js/styles/github-dark.css";

import Live2DCanvas from "../components/live2d";
import Live2dRender from "../components/live2dRender";
import Live2dProvider from "../components/live2dProvider";
import Model from "../components/live2d";
import { getLevel, getCourse, submitCourse } from "../Api";
import { CurrentLevel, CurrentCourse } from "../Interface";

import { Modal, Button } from "react-bootstrap";

type LocationState = {
  courseId: number;
  level: number;
};

function AutoMate() {
  const [collapsed, setCollapsed] = useState(false);
  const [release, setRelease] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentLevel, setCurrentLevel] = useState<CurrentLevel>();
  const [currentCourse, setCurrentCourse] = useState<CurrentCourse>();

  const location = useLocation<LocationState>();
  const { courseId, level } = location.state || { courseId: 555, level: 555 };
  const [levelToGet, setLevelToGet] = useState(level);

  const [editedFileTree, setEditedFileTree] = useState<any>(null);
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [showEmptyFileModal, setShowEmptyFileModal] = useState(false);

  const [feedback, setFeedback] = useState<string>("");
  const [submitCount, setSubmitCount] = useState<number>(0);

  const [successCount, setSuccessCount] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1100;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // Auto-collapse on mobile
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourse({ course_id: courseId });
        console.log(data.levels);
        setCurrentCourse(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      console.log("Level to get 2", levelToGet);
      try {
        const data = await getLevel({
          course_id: courseId,
          level_id: levelToGet,
        });
        console.log(data);
        setCurrentLevel(data);
        setIsLoading(false);
        setEditedFileTree(data?.file_tree);
        console.log("FILETREEONE", data?.file_tree);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
    localStorage.setItem(`course_${courseId}_level`, `${levelToGet}`);
  }, [levelToGet]);

  const triggerModal = () => {
    setShowModal(true);
  };

  const handleNext = () => {
    const levelIds = currentCourse?.levels?.map((level) => level.order_number) || [];
    const maxLevelId = Math.max(...levelIds);
    setShowModal(false);

    if (levelToGet < maxLevelId) {
      setLevelToGet((prev: number) => prev + 1);
    } else {
      navigate("/");
    }
  };

  const triggerLoadingModal = () => {
    setShowLoadingModal(true);
  };

  const triggerShowWrongModal = () => {
    setShowWrongModal(true);
  };
  const triggerShowEmptyFileModal = () => {
    setShowEmptyFileModal(true);
  };

  const handleSubmit = async (levelId: number, courseId: number) => {
    console.log("1", editedFileTree);
    setIsSubmitting(true);
    triggerLoadingModal();
    setShowEmptyFileModal(false);
    setShowWrongModal(false);
    // if (editedFileTree == null) {
    //   console.log("not edited???");
    //   setEditedFileTree(currentLevel?.file_tree);
    // }
    //console.log("2", currentLevel?.file_tree);

    try {
      const response = await submitCourse({
        level_id: levelId,
        course_id: courseId,
        user_file_tree: editedFileTree || currentLevel?.file_tree,
      });
      console.log("API response:", response);

      const result = response;
      setIsSubmitting(false);
      setShowLoadingModal(false);
      setFeedback(response.feedback);
      setSubmitCount((prev) => prev + 1);
      if (result.passed == true) {
        console.log("yay u passed");
        if (!currentCourse?.levels?.length) {
          console.error("No course selected");
          return;
        }
        triggerModal();
      } else {
        triggerShowWrongModal();
        console.log("failed. try again");
      }
    } catch (error:any) {
      setIsSubmitting(false);
      setShowLoadingModal(false);
      //if(error.response.status === 500){
        triggerShowEmptyFileModal();
      //}
      console.error("Error submitting course:", error);
      // Optionally show error feedback to user here
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Navbar - Fixed height */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#020c1b",
          borderBottom: "1px solid #1e2a3a",
        }}
      >
        <div className="container-fluid">
          <a
            className="navbar-brand fw-bold"
            href="#"
            style={{ color: "#64ffda" }}
          >
            {" "}
            {/* Teal accent */}
            Auto.Mate
          </a>
          <span className="navbar-text" style={{ color: "#8892b0" }}>
            {" "}
            {/* Muted blue-gray */}
            Your very own AI powerhouse #edTech
          </span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Sidebar - Elegant dark blue */}
        <div
          style={{
            width: collapsed ? "70px" : "500px",
            backgroundColor: "#0a192f",
            transition: "width 0.3s ease",
            overflowY: "auto",
            borderRight: "1px solid #1e2a3a",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            className="btn btn-sm m-2"
            style={{
              backgroundColor: "#112240",
              color: "#64ffda",
              alignSelf: "flex-start",
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "☰" : "✕"}
          </button>

          {!collapsed && (
            <div style={{ padding: "1rem", flex: 1 }}>
              <button
                style={{
                  backgroundColor: "#0a192f",
                  color: "#64ffda",
                  border: "1px solid #64ffda",
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigate("/")}
              >
                ← 课程列表
              </button>
              {!isLoading ? (
                <div
                  style={{
                    backgroundColor: "#ccd6f6",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      color: "darkblue",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      borderBottom: "1px solid #1e2a3a",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {currentLevel?.title}
                  </div>
                  <div style={{ color: "#8892b0" }}>
                    <p style={{ marginBottom: "1rem" }}>
                      <strong style={{ color: "darkblue" }}>章节:</strong>{" "}
                      {currentLevel?.order_number}/
                      {currentCourse?.levels.length}
                    </p>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <strong style={{ color: "darkblue" }}>描述:</strong>
                      <div style={{ color: 'white', marginTop: "0.5rem" }}>
                        <Markdown 
                        //remarkPlugins={[remarkGfm]}
                        >
                          {currentLevel?.description || ""}
                          {/* {currentLevel?.description || ""} */}
                        </Markdown>
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "darkblue" }}>要求:</strong>
                      <div style={{ marginTop: "0.5rem" }}>
                        <Markdown >
                          {currentLevel?.requirements || ""}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    color: "#64ffda",
                  }}
                >
                  <div className="spinner-grow" style={{ color: "#64ffda" }} />
                  <div style={{ marginTop: "1rem" }}>正在加载...</div>
                </div>
              )}
              
            </div>
          )}
        </div>

        {/* Main Content - Sleek dark layout */}
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "1rem",
            overflow: "auto",
            backgroundColor: "#0a192f",
          }}
        >
          {/* Editor/Terminal Column */}
          {
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginRight: "1rem",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  marginBottom: "1rem",
                  color: "#ccd6f6",
                }}
              >
                <p style={{ marginRight: "2rem" }}>
                  <strong>课程: </strong> {currentLevel?.course.title}
                </p>
                <p>
                  <strong>关卡: </strong> 
                  {currentLevel?.title}
                </p>
              </div>

              {/* Editor - Glassmorphism effect */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "rgba(17, 34, 64, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "8px",
                  border: "1px solid #1e2a3a",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  minHeight: "400px",
                }}
              >
                {(!isLoading && currentLevel?.file_tree) ? (
                  <EditorComponent
                    key={levelToGet}
                    fileTree={currentLevel?.file_tree}
                    onFileTreeChange={setEditedFileTree}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      color: "#64ffda",
                    }}
                  >
                    <div
                      className="spinner-grow"
                      style={{ color: "#64ffda" }}
                    />
                    <div style={{ marginTop: "1rem" }}>正在加载...</div>
                  </div>
                )}
              </div>

              {/* Terminal Section */}
              <div
                style={{
                  marginTop: "1rem",
                  backgroundColor: "rgba(17, 34, 64, 0.7)",
                  borderRadius: "8px",
                  padding: "1rem",
                  border: "1px solid #1e2a3a",
                }}
              >
                {(!isLoading && currentLevel) ? (
                  <button
                    style={{
                      backgroundColor: "#64ffda",
                      color: "#0a192f",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.5rem 1rem",
                      marginBottom: "1rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() =>
                      handleSubmit(currentLevel.order_number, currentLevel.course_id)
                    }
                  >
                    提交
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      color: "#64ffda",
                    }}
                  >
                    <div
                      className="spinner-grow"
                      style={{ color: "#64ffda" }}
                    />
                    <div style={{ marginTop: "1rem" }}>正在加载...</div>
                  </div>
                )}
                {showModal && (
                  <Modal
                    show={showModal}
                    //onHide={() => [setShowModal(false), handleNext]}
                    backdrop="static" // Prevents closing when clicking outside
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>关卡通过！</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="input-group mb-3 mt-3">
                        <input
                          type="text"
                          className="form-control"
                          value="通过关卡成功"
                          readOnly
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="dark" onClick={handleNext}>
                        下一关
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}
                {showLoadingModal && (
                  <Modal
                    show={showLoadingModal}
                    //onHide={() => setShowLoadingModal(false)}
                    backdrop="static" // Prevents closing when clicking outside
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>提交成功！ 正在加载...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>正在加载， 请稍等...</Modal.Body>
                  </Modal>
                )}
                {showWrongModal && (
                  <div
                    className="alert alert-warning alert-dismissible fade show d-flex justify-content-between align-items-start"
                    role="alert"
                  >
                    <div>
                      <strong>项目出错了</strong>
                      <br />
                      请看看以下的提示
                    </div>
                    <button
                      type="button"
                      className="close ms-3"
                      aria-label="Close"
                      onClick={() => setShowWrongModal(false)}
                      style={{ fontSize: "1.5rem", lineHeight: "1" }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}
                {showEmptyFileModal && (
                  <div
                    className="alert alert-warning alert-dismissible fade show d-flex justify-content-between align-items-start"
                    role="alert"
                  >
                    <div>
                      <strong>您提交了空的文件</strong>
                      <br />
                      请再试试关卡
                    </div>
                    <button
                      type="button"
                      className="close ms-3"
                      aria-label="Close"
                      onClick={() => setShowEmptyFileModal(false)}
                      style={{ fontSize: "1.5rem", lineHeight: "1" }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}

                <TerminalComponent
                  //key= {feedback}
                  feedback={feedback}
                  submitCount={submitCount}
                />
              </div>
            </div>
          }

          {/* Model Viewer - Glass panel */}
          <div
            style={{
              width: "35%",
              backgroundColor: "rgba(17, 34, 64, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "8px",
              padding: "1rem",
              border: "1px solid #1e2a3a",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <iframe
        src="https://ten-playground-app.preview.huawei-zeabur.cn/"
        style={{
          transform: "translate(-700px, -80px)",
          width: "1200px",
          height: "900px",
          pointerEvents: "auto"
        }}
        draggable="false" // Important for Firefox
      />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoMate;
