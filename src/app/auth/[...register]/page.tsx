import RegisterPage from "@/app/components/registerform";
import prismaClient from "@/app/lib/db";

const Register = async ({ searchParams }: { searchParams: { id?: string } }) => {
  const userId = searchParams?.id;

  let user = null;

  // Fetch user only if userId is present in the query parameters
  if (userId) {
    try {
      user = await prismaClient.user.findUnique({
        where: {
          id: parseInt(userId, 10),
        },
      });

      if (!user) {
        console.log("User not found");
      } else {
        console.log("Fetched user:", user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return (
    <div>
      <RegisterPage user={user} />
    </div>
  );
};

export default Register;