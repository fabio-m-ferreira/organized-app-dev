import { Document as ReactPDFDocument } from '@react-pdf/renderer';
import { PDFDocumentType } from './index.types';
import registerFonts from '@views/registerFonts';

registerFonts();

const Document = ({ title, children }: PDFDocumentType) => {
  return (
    <ReactPDFDocument
      author="Samora Correia Norte"
      title={title}
      creator="Organized"
      producer="Samora Correia Norte (by react-pdf)"
    >
      {children}
    </ReactPDFDocument>
  );
};

export default Document;
