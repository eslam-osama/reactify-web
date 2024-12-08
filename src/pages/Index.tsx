import { useState } from "react";
import { Post } from "@/types/post";
import { PostCard } from "@/components/PostCard";
import { CreatePostModal } from "@/components/CreatePostModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { toast } = useToast();

  const handleCreatePost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toLocaleString(),
      user: "User",
    };
    setPosts([newPost, ...posts]);
    toast({
      title: "Post created",
      description: "Your post has been published successfully.",
    });
  };

  const handleEditPost = (content: string) => {
    if (editingPost) {
      setPosts(
        posts.map((post) =>
          post.id === editingPost.id
            ? { ...post, content, createdAt: new Date().toLocaleString() }
            : post
        )
      );
      setEditingPost(null);
      toast({
        title: "Post updated",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleDeletePost = () => {
    if (postToDelete) {
      setPosts(posts.filter((post) => post.id !== postToDelete.id));
      setPostToDelete(null);
      setDeleteModalOpen(false);
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="hover-scale"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={(post) => {
                setEditingPost(post);
                setCreateModalOpen(true);
              }}
              onDelete={(post) => {
                setPostToDelete(post);
                setDeleteModalOpen(true);
              }}
            />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No posts yet. Create your first post!
            </div>
          )}
        </div>

        <CreatePostModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={editingPost ? handleEditPost : handleCreatePost}
          initialContent={editingPost?.content}
          mode={editingPost ? "edit" : "create"}
        />

        <DeleteConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleDeletePost}
        />
      </div>
    </div>
  );
};

export default Index;