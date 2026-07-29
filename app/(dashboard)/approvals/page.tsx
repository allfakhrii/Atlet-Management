import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import ApprovalList from "./ApprovalList"

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  const pendingUsers = await prisma.user.findMany({
    where: { role: "ATHLETE", isApproved: false },
    include: { athlete: true }
  })

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Pending Approvals</h1>
        <p className="text-slate-400 mt-1">Kelola pendaftaran atlet yang menunggu persetujuan Anda.</p>
      </div>
      <ApprovalList initialUsers={pendingUsers} />
    </div>
  )
}
