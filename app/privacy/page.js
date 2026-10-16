import LegalShell, { Email } from "../../components/LegalShell";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How najmulhasan.navicore.co handles contact messages, analytics, cookies and Google API (Blogger) access, in plain language.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updatedIso="2026-10-16" updatedLabel="16 October 2026">
      <p>
        This policy explains what happens to your information when you use{" "}
        <strong>najmulhasan.navicore.co</strong> (the &ldquo;site&rdquo;). It describes what the
        site does today, and we will update it when that changes.
      </p>

      <h2>Who we are</h2>
      <p>
        The site is operated by <strong>Najmul Hasan</strong> (also known as Shariar Ahmed),
        based in Dhaka, Bangladesh. For any question or request about your data, contact:{" "}
        <Email />.
      </p>

      <h2>What the site collects, and why</h2>
      <p>
        The site has no user accounts for visitors, shows no advertising, and we do not sell
        personal data. This is everything it handles:
      </p>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Why</th>
            <th>Legal basis (simple)</th>
            <th>Who handles it</th>
            <th>How long</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Contact form:</strong> name, email address, subject and message, only if you
              send the form
            </td>
            <td>To read and answer your message</td>
            <td>You asked us to get in touch; our interest in replying</td>
            <td>Formspree (form service). Your browser sends the form to Formspree directly.</td>
            <td>
              Until your message is dealt with, then deleted when no longer needed. Ask us for
              earlier deletion any time. Formspree also keeps submissions under its own settings.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Page views and performance:</strong> which pages are visited and how fast
              they load
            </td>
            <td>To understand visits and keep the site fast</td>
            <td>Our interest in running a working site</td>
            <td>Vercel (Web Analytics and Speed Insights)</td>
            <td>Under Vercel&rsquo;s own retention rules</td>
          </tr>
          <tr>
            <td>
              <strong>Standard request data:</strong> IP address, browser type, pages requested,
              time
            </td>
            <td>To deliver the site and keep it secure</td>
            <td>Our interest in a safe, working site</td>
            <td>Vercel (hosting)</td>
            <td>Under Vercel&rsquo;s own retention rules</td>
          </tr>
          <tr>
            <td>
              <strong>Fonts, icons and images from other hosts:</strong> your browser asks Google
              Fonts (fonts.googleapis.com, fonts.gstatic.com), Font Awesome on cdnjs.cloudflare.com
              (Cloudflare) and res.cloudinary.com (Cloudinary, the profile photo) for files
            </td>
            <td>To display the site</td>
            <td>Our interest in showing the site properly</td>
            <td>Google, Cloudflare, Cloudinary. They see your IP address and browser details, as in any web request.</td>
            <td>Under each company&rsquo;s own policy</td>
          </tr>
          <tr>
            <td>
              <strong>Admin sign-in attempts:</strong> only if someone sends a request to the
              private admin login. Your IP address is counted so repeated guessing can be blocked.
            </td>
            <td>Security</td>
            <td>Our interest in protecting the admin area</td>
            <td>Upstash (Redis database), when this protection is switched on</td>
            <td>The counter expires automatically after 10 minutes</td>
          </tr>
        </tbody>
      </table>
      <p>
        Under laws such as the EU and UK GDPR you may have rights to access, correct, delete or
        object to the use of your data. To use them, email <Email />. Data held by the companies
        above may also need to be requested from them; we will help where we can.
      </p>

      <h2>Cookies</h2>
      <p>The site&rsquo;s own code sets one cookie, and only for the site owner:</p>
      <ul>
        <li>
          <strong>Name:</strong> <code>adm_session</code>
        </li>
        <li>
          <strong>Purpose:</strong> keeps the owner signed in to the private admin area. It is
          only set after the correct admin password is entered. Visitors never receive it.
        </li>
        <li>
          <strong>Settings:</strong> HttpOnly (not readable by page scripts), SameSite=Strict, and
          Secure (HTTPS only) on the live site
        </li>
        <li>
          <strong>Lifetime:</strong> 12 hours
        </li>
        <li>
          <strong>Contents:</strong> an expiry time and a cryptographic signature. No personal
          data.
        </li>
      </ul>
      <p>
        The site&rsquo;s code sets no advertising or tracking cookies and does not use
        localStorage or sessionStorage. The third-party services listed above handle your
        requests under their own policies.
      </p>

      <h2>Google API services (Blogger)</h2>
      <p>
        The site&rsquo;s private admin tool can publish a short Bangla summary of an article, with
        a link to the original, to the site owner&rsquo;s own Blogger blog. It uses the Google
        Blogger API with OAuth and this scope: <code>https://www.googleapis.com/auth/blogger</code>.
      </p>
      <ul>
        <li>
          Only the site owner&rsquo;s own Google account is connected. Visitors are never asked to
          sign in with Google, and the site has no Google sign-in for visitors.
        </li>
        <li>
          It runs only when the signed-in owner chooses to publish, and only to create a post that
          the owner wrote (title, summary text, link and labels).
        </li>
        <li>
          The OAuth credentials (client ID, client secret and refresh token) are stored as private
          server settings at the hosting provider. They are not in the public code and are never
          shown to visitors.
        </li>
        <li>
          The site does not collect, store or share any other user&rsquo;s Google data. The only
          item kept from Google&rsquo;s response is the web address of the post that was created,
          saved in that article&rsquo;s file in the site&rsquo;s code repository on GitHub.
        </li>
        <li>
          We do not use Google user data for advertising, we do not sell it, and we do not use it
          to train AI models.
        </li>
      </ul>
      <p>
        The use and transfer of information received from Google APIs will adhere to the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>Other owner-only integrations</h2>
      <p>
        The same admin tool uses the owner&rsquo;s own accounts to save article files to GitHub,
        cross-post articles to dev.to and Hashnode, and tell search engines about new pages
        through IndexNow. These requests carry content the owner has written for publication
        (article text, titles and links). They do not carry visitor data.
      </p>

      <h2>International transfers</h2>
      <p>
        The companies named above may process data outside Bangladesh, including in the United
        States and other countries where they operate. By using the site or sending a message you
        understand your data may be handled there under those companies&rsquo; terms.
      </p>

      <h2>Children</h2>
      <p>
        The site is not aimed at children, and we do not knowingly collect personal data from
        children under 13. If you believe a child has sent us a message, email <Email /> and we
        will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the site&rsquo;s behaviour changes, we will update this page and the &ldquo;Last
        updated&rdquo; date above. Please check back from time to time.
      </p>

      <h2>Contact</h2>
      <p>
        Najmul Hasan, Dhaka, Bangladesh. Email: <Email />.
      </p>
    </LegalShell>
  );
}
