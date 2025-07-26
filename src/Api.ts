const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const listClasses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses/list`, {
    method: "POST", // Specify this is a POST request
    headers: {
      "Content-Type": "application/json",
      // Add other headers if needed (e.g., authentication)
    },
    // Include a body if the endpoint requires it (empty object if no params needed)
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error("Network error");
  return response.json();
};

interface GetLevelParams {
  course_id: number;
  level_id: number;
}

export const getLevel = async (params: GetLevelParams) => {
  console.log(params);
  const response = await fetch(`${API_BASE_URL}/api/levels/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add authentication header if needed
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      course_id: params.course_id,
      level_id: params.level_id,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch level");
  }

  return response.json();
};

interface CreateCourseParams {
  description: string;
  git_url: string;
  tag: string;
  title: string;
}

export const createCourse = async (params: CreateCourseParams) => {
  console.log(params);
  const response = await fetch(`${API_BASE_URL}/api/courses/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add authentication header if needed
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      description: params.description,
      git_url: params.git_url,
      tag: params.tag,
      title: params.title,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch level");
  }
  return response.json();
};

interface GetCourseParams {
  course_id: number;
}
export const getCourse = async (params: GetCourseParams) => {
  console.log("PARAMS", params);
  const response = await fetch(
    `${API_BASE_URL}/api/courses/get/${params.course_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication header if needed
        // "Authorization": `Bearer ${token}`
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch course");
  }

  return response.json();
};

interface FileTreeNode {
  type: 'file' | 'directory';
  uri: string;
  children: FileTreeNode[] | null;
  content: string | null;
}

interface SubmitCourseParams {
  level_id: number,
  course_id: number,
  user_file_tree: FileTreeNode,

}


export const submitCourse = async (params: SubmitCourseParams) => {
  console.log("PARAMS TO CHECK", params);
  const response = await fetch(`${API_BASE_URL}/api/levels/check-completion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add authentication header if needed
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      level_id:params.level_id,
      course_id: params.course_id,
      user_file_tree: params.user_file_tree
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit");
  }
  return response.json();
};
