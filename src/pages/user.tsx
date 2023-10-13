import { useLocation, useParams } from 'umi';

export default function User() {
  const params = useParams();
  const location = useLocation();

  console.log({ params, location });
  return (
    <section>
      <p>User</p>
    </section>
  );
}
