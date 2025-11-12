import Link from "next/link";

export const ContentFooter = () => (
  <div className="mt-12 border-t pt-8">
    <h3 style={{ marginTop: '1.5rem' }}>
      Feel stuck?{" "}
      <Link
        href="https://discord.gg/celestiacommunity"
        style={{
          color: "var(--nextra-primary-color)",
          textDecoration: "underline",
        }}
      >
        Go to our Discord!
      </Link>
    </h3>
  </div>
);