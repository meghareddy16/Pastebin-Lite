import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CopyButton from "./CopyButton";

async function getPaste(id: string) {
  const headersList = headers();
//   const host = headersList.get("host");
  const host = (await headersList).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getPaste(id);

  if (!data) notFound();

  return (
     <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-xl font-bold mb-4 text-black">Your Paste</h1>

        <pre
          id="paste-content"
          className="bg-gray-900 text-green-300 p-4 rounded overflow-x-auto"
        >
          {data.content}
        </pre>

        <CopyButton text={data.content} />


        <div className="mt-4 text-md text-gray-600">
          {data.remaining_views !== null && (
            <p>Remaining views: {data.remaining_views}</p>
          )}
          {data.expires_at && (
            <p>
              Expires at:{" "}
              {new Date(data.expires_at).toLocaleString()}
            </p>
          )}
        </div>
        <div className="mt-4 text-md text-gray-600"><strong>Note:</strong> When you open the same URL multiple times will reduce the Views Counts, if Views reaches '0' shows 404 error</div>
      </div>
    </main>

  );
}
