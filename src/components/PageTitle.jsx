import { useEffect } from "react";

/**
 * PageTitle component for setting the document title
 * @param {Object} props - Component props
 * @param {string} props.title - The title to set for the page
 */
function PageTitle({ title }) {
  useEffect(() => {
    // Set the document title when the component mounts
    const previousTitle = document.title;
    document.title = title ? `${title} | Plus 15 Skywalk` : "Plus 15 Skywalk";

    // Restore the previous title when the component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  // This component doesn't render anything
  return null;
}

export default PageTitle;
