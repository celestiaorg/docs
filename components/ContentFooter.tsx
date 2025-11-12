import Link from "next/link";

export const ContentFooter = () => (
  <div>
    <br />
    <h3>
      Feel stuck?{" "}
      <Link
        href="https://discord.gg/celestiacommunity"
        style={{
          color: "var(--nextra-primary-color)",
          textDecoration: "underline",
        }}
      >
        Go to our discord!
      </Link>
    </h3>
  </div>
);
