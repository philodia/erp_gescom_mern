import React from 'react';
import { Breadcrumb as BootstrapBreadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

/**
 * A breadcrumb component for navigation.
 *
 * @param {object} props
 * @param {Array<{label: string, path?: string}>} props.items - An array of objects representing the breadcrumb items.
 *   - label: The text to display.
 *   - path (optional): The path to which the link should redirect. If not provided, it's the current page.
 * @returns {JSX.Element}
 */
const Breadcrumb = ({ items = [] }) => {
  // Start with the home page (Dashboard)
  const breadcrumbItems = [
    { label: <FaHome />, path: '/dashboard' },
    ...items,
  ];

  return (
    <BootstrapBreadcrumb className="breadcrumb-container mb-4">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        return (
          <BootstrapBreadcrumb.Item
            key={item.path || index}
            active={isLast}
          >
            {isLast || !item.path ? (
              // If it's the last item or has no path, display plain text
              item.label
            ) : (
              // Otherwise, display a React Router link
              <Link to={item.path}>{item.label}</Link>
            )}
          </BootstrapBreadcrumb.Item>
        );
      })}
    </BootstrapBreadcrumb>
  );
};

export default Breadcrumb;
