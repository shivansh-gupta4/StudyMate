import CourseInputPage from '@/app/components/courseinputpage'
import prismaClient from "@/app/lib/db";

export default async function Page({ params }: { params: { id: string } }) {
    const userId = params?.id;

    let user = null;
  
    // Fetch user based on `id` in the URL path
    if (userId) {
      try {
        user = await prismaClient.user.findUnique({
          where: {
            id: parseInt(userId, 10), // Convert id from string to number
          },
        });
  
        if (!user) {
          console.log("User not found");
        } else {
          console.log("Fetched user:",user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  return (
    <div><CourseInputPage user={user}/></div>
  )
}
