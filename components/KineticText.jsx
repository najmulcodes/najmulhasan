"use client";
import { motion } from "framer-motion";

/**
 * Masked, staggered word reveal — each word slides up from behind an
 * overflow-hidden mask rather than a plain fade. This is the signature
 * text treatment on most award-tier agency sites (Unseen Studio, Locomotive,
 * Resn, etc.) and it's genuinely just CSS overflow + a framer-motion
 * stagger, no bespoke asset needed.
 */
export default function KineticText({ text, as: Tag = "span", className = "", delay = 0, stagger = 0.06, scrollTrigger = false, ...props }) {
  const words = text.split(" ");
  const motionProps = scrollTrigger
    ? { whileInView: { y: "0%", opacity: 1 }, viewport: { once: true, margin: "-10% 0px" } }
    : { animate: { y: "0%", opacity: 1 } };

  return (
    <Tag className={className} {...props}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            {...motionProps}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
