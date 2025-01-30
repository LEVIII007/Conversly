import NavigationButtons from "@/components/Blogs/bottom-navigation";
import BlogHero from "@/components/Blogs/second/hero";
import { BlogContent } from "@/components/Blogs/second/main_content";
import ShareButtons from "@/components/Blogs/share";


export default function BlogPage() {
    return (
    <div>
      <BlogHero />
      <BlogContent />
      <ShareButtons />
      <NavigationButtons />
    </div>
  );
}