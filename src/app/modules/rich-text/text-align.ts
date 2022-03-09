import {Extension} from '@tiptap/core';

export interface TextAlignOptions {
  types: string[];
  alignments: string[];
  defaultAlignment: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      /**
       * Set the text align attribute
       */
      setTextAlign: (alignment: string) => ReturnType,
      /**
       * Unset the text align attribute
       */
      unsetTextAlign: () => ReturnType,
    };
  }
}

export const TextAlign = Extension.create<TextAlignOptions>({
  name: 'textAlign',

  addOptions(): any {
    return {
      types: [],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    };
  },

  addGlobalAttributes(): any[] {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element: HTMLElement): string => element.style.textAlign || this.options.defaultAlignment,
            renderHTML: (attributes: any): any => {
              if (attributes.textAlign === this.options.defaultAlignment) {
                return {};
              }

              return { class: `ql-align-${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },

  addCommands(): any {
    return {
      setTextAlign: (alignment: string) => ({ commands }: any): boolean => {
        if (!this.options.alignments.includes(alignment)) {
          return false;
        }

        return this.options.types.every(type => commands.updateAttributes(type, { textAlign: alignment }));
      },

      unsetTextAlign: () => ({ commands }: any): boolean => {
        return this.options.types.every(type => commands.resetAttributes(type, 'textAlign'));
      },
    };
  },

  addKeyboardShortcuts(): any {
    return {
      'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
      'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
    };
  },
});
