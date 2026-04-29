import { Link } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';

export function UserListPage() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <p className="text-muted-foreground">Loading users...</p>;
  if (error) return <p className="text-destructive">Failed to load users: {error.message}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Verified</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link to={`/users/${user.id}`} className="font-medium hover:underline">
                    {user.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{user.role}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.isEmailVerified ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {data?.results.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data && (
        <p className="text-sm text-muted-foreground">
          Page {data.page} of {data.totalPages} — {data.totalResults} total
        </p>
      )}
    </div>
  );
}
