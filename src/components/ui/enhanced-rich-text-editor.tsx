
import React, { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  // TinyMCE configuration
  const editorConfig = {
    height,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
      'emoticons', 'template', 'paste', 'textcolor', 'colorpicker',
      'textpattern', 'imagetools', 'toc', 'hr', 'pagebreak', 'nonbreaking',
      'quickbars'
    ],
    toolbar: [
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
      'outdent indent | numlist bullist checklist | forecolor backcolor removeformat | pagebreak | charmap emoticons',
      'fullscreen preview save | insertfile image media pageembed template link anchor codesample | ltr rtl | code'
    ].join(' | '),
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    quickbars_insert_toolbar: 'quickimage quicktable',
    contextmenu: 'link image imagetools table',
    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
    content_css: theme === 'dark' ? 'dark' : 'default',
    body_class: theme === 'dark' ? 'dark-mode' : 'light-mode',
    placeholder,
    content_style: `
      body { 
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        font-size: 14px;
        line-height: 1.6;
        color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
        background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
        padding: 12px;
      }
      .dark-mode {
        background-color: #1f2937;
        color: #e5e7eb;
      }
      .light-mode {
        background-color: #ffffff;
        color: #374151;
      }
      pre {
        background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
        border: 1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'};
        border-radius: 6px;
        padding: 12px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
      blockquote {
        border-left: 4px solid ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
        margin: 16px 0;
        padding: 8px 16px;
        background-color: ${theme === 'dark' ? '#374151' : '#f8fafc'};
        font-style: italic;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;
      }
      table td, table th {
        border: 1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'};
        padding: 8px 12px;
      }
      table th {
        background-color: ${theme === 'dark' ? '#374151' : '#f9fafb'};
        font-weight: 600;
      }
    `,
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'CSS', value: 'css' },
      { text: 'PHP', value: 'php' },
      { text: 'Ruby', value: 'ruby' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C#', value: 'csharp' },
      { text: 'C++', value: 'cpp' }
    ],
    image_advtab: true,
    image_uploadtab: true,
    file_picker_types: 'image',
    paste_data_images: true,
    automatic_uploads: true,
    readonly: readOnly,
    branding: false,
    promotion: false,
    resize: 'both',
    min_height: 200,
    max_height: 800,
    setup: (editor: any) => {
      editor.on('init', () => {
        // Apply theme-specific styling after initialization
        const iframe = editor.getDoc();
        if (iframe) {
          const style = iframe.createElement('style');
          style.textContent = `
            body {
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
            }
          `;
          iframe.head.appendChild(style);
        }
      });
    }
  };

  return (
    <div className={cn("tinymce-editor-wrapper", className)}>
      <Editor
        apiKey="no-api-key" // Using no-api-key for development
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        init={editorConfig}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default EnhancedRichTextEditor;
