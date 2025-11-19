export default async function ProfilePage(props: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await props.params;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Профіль користувача</h1>
        <p className="text-gray-600">ID: {id}</p>
      </div>
    );
  }