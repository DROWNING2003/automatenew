export interface Level {
    id: number,
    order_number: number,
    title: string
}
export interface Course {
    description: string,
    id: number,
    image_url: string,
    levels: Level[],
    tag: string,
    title: string
}


interface FileTreeNode {
    type: 'file' | 'directory';
    uri: string;
    children: FileTreeNode[] | null;
    content: string | null;
  }
  
  interface LevelCourse {
    id: number;
    title: string;
    tag: string;
  }
  
  export interface CurrentLevel {
    id: number;
    course_id: number;
    title: string;
    description: string;
    requirements: string;
    order_number: number;
    content: string | null;
    created_at: string;
    updated_at: string;
    course: LevelCourse;
    file_tree: FileTreeNode;
  }

export interface CourseLevel {
    id: number,
    title: string, 
    order_number: number
}
export interface CurrentCourse {
    id: number,
    title: string,
    tag: string,
    description: string,
    git_url: string,
    image_url: string,
    created_at: Date,
    updated_at: Date,
    levels: CourseLevel[]
}
