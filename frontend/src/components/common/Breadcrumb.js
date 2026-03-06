import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-zinc-500 mb-6">
      <Link to="/" className="flex items-center hover:text-zinc-900 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 mx-2" />
          {index === items.length - 1 ? (
            <span className="text-zinc-900 font-medium">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-zinc-900 transition-colors">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;