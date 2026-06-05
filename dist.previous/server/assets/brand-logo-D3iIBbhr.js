import { jsxs, jsx } from "react/jsx-runtime";
function BrandLogo({ className = "", variant = "dark", markOnly = false }) {
  const text = variant === "light" ? "#FFF9F5" : "#2D1B0D";
  const accent = "#FF7E5F";
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-2 ${className}`, children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 40 40", className: "h-7 w-7 shrink-0", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "bl-g", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#FF7E5F" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#FEB47B" })
      ] }) }),
      /* @__PURE__ */ jsx("rect", { width: "40", height: "40", rx: "10", fill: "url(#bl-g)" }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M28 14c-1.3-1.9-3.8-3-7-3-4.5 0-7.5 2.5-7.5 6.2 0 3.1 2.5 4.4 6.9 5.6 3.8 1.1 5 1.9 5 3.6 0 1.9-1.9 3.1-5 3.1-2.5 0-4.4-.6-6.3-2.4l-1.9 3.1c2.5 2.5 5 3.1 8.1 3.1 5 0 8.1-2.5 8.1-6.9 0-3.7-2.5-5-7.5-6.2-3.1-.6-4.4-1.9-4.4-3.1 0-1.9 1.9-3.1 4.4-3.1 1.9 0 3.8.6 5 2.5z",
          fill: "#fff"
        }
      )
    ] }),
    !markOnly && /* @__PURE__ */ jsxs(
      "span",
      {
        className: "text-xl font-extrabold tracking-tight leading-none",
        style: { color: text, fontFamily: "'Outfit', system-ui, sans-serif", letterSpacing: "-0.02em" },
        children: [
          "sleep",
          /* @__PURE__ */ jsx("span", { style: { color: accent }, children: "ox" })
        ]
      }
    )
  ] });
}
export {
  BrandLogo as B
};
