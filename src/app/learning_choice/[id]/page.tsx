import CourseInputPage from '@/app/components/courseinputpage'
import prismaClient from "@/app/lib/db";

// Enable static generation for better performance
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
    const userId = params?.id;

    let user = null;
  
    // Fetch user based on `id` in the URL path
    if (userId) {
      try {
        user = await prismaClient.user.findUnique({
          where: {
            id: parseInt(userId, 10),
          },
        });
  
        if (!user) {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  return (
    <div><CourseInputPage user={user}/></div>
  )
}
