export function JsonLd({
  data,
}: {
  data: object | null | (object | null)[];
}) {
  const payload = (Array.isArray(data) ? data : [data]).filter(
    (d): d is object => d != null,
  );
  return (
    <>
      {payload.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
