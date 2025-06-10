
import React, { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { cn } from '@/lib/utils';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  height?: number;
}

const EnhancedRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Մուտքագրեք բովանդակությունը...", 
  className,
  readOnly = false,
  height = 400
}: EnhancedRichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  const editorConfiguration = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        '|',
        'outdent',
        'indent',
        '|',
        'alignment',
        '|',
        'link',
        'insertImage',
        'insertTable',
        'mediaEmbed',
        '|',
        'codeBlock',
        'blockQuote',
        'horizontalLine',
        '|',
        'specialCharacters',
        'subscript',
        'superscript',
        '|',
        'undo',
        'redo',
        '|',
        'findAndReplace',
        'selectAll'
      ],
      shouldNotGroupWhenFull: true
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'python', label: 'Python' },
        { language: 'java', label: 'Java' },
        { language: 'c', label: 'C' },
        { language: 'cpp', label: 'C++' },
        { language: 'csharp', label: 'C#' },
        { language: 'php', label: 'PHP' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'go', label: 'Go' },
        { language: 'rust', label: 'Rust' },
        { language: 'html', label: 'HTML' },
        { language: 'css', label: 'CSS' },
        { language: 'scss', label: 'SCSS' },
        { language: 'sql', label: 'SQL' },
        { language: 'json', label: 'JSON' },
        { language: 'xml', label: 'XML' },
        { language: 'yaml', label: 'YAML' },
        { language: 'bash', label: 'Bash' },
        { language: 'shell', label: 'Shell' }
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        'linkImage'
      ]
    },
    link: {
      decorators: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    mediaEmbed: {
      previewsInData: true
    },
    placeholder: placeholder,
    language: 'en'
  };

  return (
    <div className={cn("bg-background border border-border rounded-lg overflow-hidden", className)}>
      <style jsx global>{`
        .ck-editor__editable {
          min-height: ${height}px !important;
          font-family: 'Noto Sans Armenian', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .ck.ck-toolbar {
          background: hsl(var(--background)) !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
        }
        
        .ck.ck-toolbar .ck-toolbar__separator {
          background: hsl(var(--border)) !important;
        }
        
        .ck.ck-button:not(.ck-disabled):hover {
          background: hsl(var(--hover-bg)) !important;
        }
        
        .ck.ck-button.ck-on {
          background: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }
        
        .ck-content code {
          background: hsl(var(--muted)) !important;
          color: hsl(var(--foreground)) !important;
          padding: 2px 4px !important;
          border-radius: 4px !important;
          font-family: 'Courier New', Courier, monospace !important;
        }
        
        .ck-content pre {
          background: hsl(var(--muted)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 6px !important;
          padding: 16px !important;
          overflow-x: auto !important;
        }
        
        .ck-content pre code {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        
        .ck-content blockquote {
          border-left: 4px solid hsl(var(--edu-blue)) !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          font-style: italic !important;
          color: hsl(var(--muted-foreground)) !important;
        }
        
        .ck-content table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 16px 0 !important;
        }
        
        .ck-content table td,
        .ck-content table th {
          border: 1px solid hsl(var(--border)) !important;
          padding: 8px 12px !important;
        }
        
        .ck-content table th {
          background: hsl(var(--muted)) !important;
          font-weight: 600 !important;
        }
        
        .ck-content a {
          color: hsl(var(--edu-blue)) !important;
          text-decoration: underline !important;
        }
        
        .ck-content a:hover {
          color: hsl(var(--edu-dark-blue)) !important;
        }
        
        .ck-content h1,
        .ck-content h2,
        .ck-content h3,
        .ck-content h4,
        .ck-content h5,
        .ck-content h6 {
          font-family: 'Noto Sans Armenian', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
          font-weight: 600 !important;
          margin-top: 24px !important;
          margin-bottom: 12px !important;
        }
        
        .ck-content h1 { font-size: 2em !important; }
        .ck-content h2 { font-size: 1.5em !important; }
        .ck-content h3 { font-size: 1.17em !important; }
        .ck-content h4 { font-size: 1em !important; }
        .ck-content h5 { font-size: 0.83em !important; }
        .ck-content h6 { font-size: 0.75em !important; }
        
        .ck-content ul,
        .ck-content ol {
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }
        
        .ck-content li {
          margin: 4px 0 !important;
        }
        
        .ck-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 6px !important;
          margin: 16px 0 !important;
        }
        
        .ck-content .todo-list {
          list-style: none !important;
          padding-left: 0 !important;
        }
        
        .ck-content .todo-list li {
          position: relative !important;
          padding-left: 24px !important;
        }
        
        .ck-content .todo-list li::before {
          content: '☐' !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          color: hsl(var(--muted-foreground)) !important;
        }
        
        .ck-content .todo-list li.todo-list__item--completed::before {
          content: '☑' !important;
          color: hsl(var(--success-green)) !important;
        }
        
        .ck-content .todo-list li.todo-list__item--completed {
          text-decoration: line-through !important;
          color: hsl(var(--muted-foreground)) !important;
        }
        
        .ck.ck-editor {
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 8px !important;
        }
        
        .ck.ck-editor__editable:focus {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        .ck.ck-editor__editable {
          border: none !important;
        }
      `}</style>
      
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value}
        disabled={readOnly}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor) => {
          editorRef.current = editor;
          console.log('Enhanced editor is ready', editor);
        }}
        onError={(error, { willEditorRestart }) => {
          if (willEditorRestart) {
            editorRef.current?.ui.getEditableElement()?.removeEventListener('paste', () => {});
          }
          console.error('CKEditor error:', error);
        }}
      />
    </div>
  );
};

export default EnhancedRichTextEditor;
