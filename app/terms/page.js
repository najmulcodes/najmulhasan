import LegalShell, { Email } from "../../components/LegalShell";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms for using najmulhasan.navicore.co: acceptable use, content ownership, no warranty, third-party links, the private admin area and governing law.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updatedIso="2026-10-17" updatedLabel="17 October 2026">
      <p>
        These terms apply when you use <strong>najmulhasan.navicore.co</strong> (the
        &ldquo;site&rdquo;), operated by Najmul Hasan (also known as Shariar Ahmed). By using the
        site you agree to them. If you do not agree, please do not use the site. How your data is
        handled is explained in the <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>What the site is</h2>
      <p>
        The site is the personal portfolio and blog of Najmul Hasan. It describes projects and
        publishes technical articles. It is not a service you sign up to, and it has no accounts
        for visitors.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          try to get into the private admin area or the <code>/api/admin</code> routes, or test
          their security (probing, guessing passwords, overloading them) without written
          permission
        </li>
        <li>
          overload the site or copy it in bulk in a way that harms it or other visitors
        </li>
        <li>
          use the contact form for spam, abuse, unlawful content or malware, or to pretend to be
          someone else
        </li>
        <li>
          copy or mirror the site&rsquo;s content in a way that suggests it is yours
        </li>
      </ul>

      <h2>Content and ownership</h2>
      <p>
        Unless stated otherwise, the articles, text, design and images on the site belong to
        Najmul Hasan, all rights reserved. Please link to articles rather than copying them, and
        ask before republishing them. Names, logos and trademarks of other companies and projects
        belong to their owners.
      </p>
      <p>
        These terms do not give you a licence to the site&rsquo;s source code or to code samples
        in articles. If a repository or an article states a licence for particular code, that
        licence applies to that code.
      </p>

      <h2>Articles are for information only</h2>
      <p>
        Articles share engineering experience. Technology changes, so articles may be incomplete
        or out of date. Nothing on the site is professional, legal, security or financial advice.
        If you use an idea or code sample from an article, test it first. You are responsible for
        how you use it.
      </p>

      <h2>No warranty</h2>
      <p>
        The site and everything on it are provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo;, without warranties of any kind, express or implied, as far as the law
        allows. We do not promise the site will always be available or free of errors.
      </p>

      <h2>Limit of liability</h2>
      <p>
        As far as the law allows, Najmul Hasan is not liable for indirect or consequential loss,
        or for loss of data, profit or business, arising from your use of the site, its articles
        or its code samples. Nothing in these terms limits liability that cannot be limited by
        law.
      </p>

      <h2>Links to other sites</h2>
      <p>
        The site links to sites we do not control, such as GitHub, LinkedIn, dev.to, Hashnode,
        Medium, Blogger, Facebook and demos of projects. We are not responsible for their content or how
        they handle your data.
      </p>

      <h2>Contact form</h2>
      <p>
        If you send a message through the contact form, you confirm it is yours to send and you
        allow us to use it to reply to you. See the <a href="/privacy">Privacy Policy</a> for how
        it is handled.
      </p>

      <h2>The admin area is private</h2>
      <p>
        The <code>/admin</code> area and <code>/api/admin</code> routes are private tools for the
        site owner. They are not a public service and no accounts are offered. Attempts to access
        them without permission are prohibited and may be blocked or reported.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. The &ldquo;Last updated&rdquo; date above shows the current
        version. If you keep using the site after a change, you accept the updated terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Bangladesh, and the courts of Bangladesh have
        jurisdiction over any dispute about them.
      </p>

      <h2>Contact</h2>
      <p>
        Najmul Hasan, Dhaka, Bangladesh. Email: <Email />.
      </p>
    </LegalShell>
  );
}
