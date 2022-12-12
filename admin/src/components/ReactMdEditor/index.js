import React, { useState } from "react";
import PropTypes from "prop-types";
import MDEditor, { commands } from "@uiw/react-md-editor";
import MediaLib from "../MediaLib";
import styled from "styled-components";
import "@uiw/react-markdown-preview/dist/markdown.css";
import "@uiw/react-md-editor/dist/markdown-editor.css";
import { Stack } from "@strapi/design-system/Stack";
import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { useIntl } from "react-intl";

const Wrapper = styled.div`
  > div:nth-child(2) {
    display: none;
  }
  .w-md-editor-bar {
    display: none;
  }
  .w-md-editor {
    border: 1px solid #dcdce4;
    border-radius: 4px;
    box-shadow: none;
    &:focus-within {
      border: 1px solid #4945ff;
      box-shadow: #4945ff 0px 0px 0px 2px;
    }
    min-height: 400px;
    display: flex;
    flex-direction: column;
    img {
      max-width: 100%;
    }
    .w-md-editor-preview {
      display: block;
      strong {
        font-weight: bold;
      }
      em {
        font-style: italic;
      }
    }
  }
  .w-md-editor-content {
    flex: 1 1 auto;
  }
  .w-md-editor-fullscreen {
    z-index: 3;
  }
  .w-md-editor-text {
    margin: 0;
  }
  .wmde-markdown {
    display: none;
  }
  .w-md-editor-preview ol {
    list-style: auto;
  }
`;

const Editor = ({
  name,
  onChange,
  value,
  intlLabel,
  disabled,
  error,
  description,
  required,
}) => {
  const { formatMessage } = useIntl();
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [mediaLibSelection, setMediaLibSelection] = useState(-1);

  const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);

  const handleChangeAssets = (assets) => {
    let newValue = value ? value : "";
    assets.map((asset) => {
      if (asset.mime.includes("image")) {
        const imgTag = ` ![](${asset.url}) `;
        if (mediaLibSelection > -1) {
          newValue =
            value.substring(0, mediaLibSelection) +
            imgTag +
            value.substring(mediaLibSelection);
        } else {
          newValue = `${newValue}${imgTag}`;
        }
      }
      // Handle videos and other type of files by adding some code
    });
    onChange({ target: { name, value: newValue || "" } });
    handleToggleMediaLib();
  };
  return (
    <Stack size={1}>
      <Box>
        <Typography variant="pi" fontWeight="bold">
          {formatMessage(intlLabel)}
        </Typography>
        {required && (
          <Typography variant="pi" fontWeight="bold" textColor="danger600">
            *
          </Typography>
        )}
      </Box>
      <Wrapper>
        <MDEditor
          disabled={disabled}
          commands={[
            commands.title2,
            commands.title3,
            commands.title4,
            commands.title5,
            {
              name: "twitter",
              keyCommand: "twitter",
              buttonProps: { "aria-label": "Insert title3" },
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              ),
              execute: (state, api) => {
                const text = `###### ${state.selectedText}`;
                api.replaceSelection(text);
              },
            },
            commands.divider,
            commands.bold,
            commands.codeBlock,
            commands.italic,
            commands.hr,
            commands.group,
            commands.divider,
            commands.link,
            commands.quote,
            commands.code,
            {
              name: "image",
              keyCommand: "image",
              buttonProps: { "aria-label": "Insert title3" },
              icon: (
                <svg width="12" height="12" viewBox="0 0 20 20">
                  <path
                    fill="currentColor"
                    d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
                  ></path>
                </svg>
              ),
              execute: (state, api) => {
                setMediaLibSelection(state.selection.end);
                handleToggleMediaLib();
              },
            },
            {
              name: "center",
              keyCommand: "center",
              buttonProps: { "aria-label": "Insert title3" },
              icon: (
                <svg width="12" height="12" viewBox="0 0 31.668 31.668">
                  <path
                    fill="currentColor"
                    d="M25.501,5H6.167V0h19.334V5z M0.168,8.889v5H31.5v-5H0.168z M6.167,17.777v5h19.334v-5H6.167z M0.168,31.668H31.5v-5H0.168
		V31.668z"
                  />
                </svg>
              ),
              execute: (state, api) => {
                const modifyText = `<div align="center">${state.selectedText}</div>`;
                api.replaceSelection(modifyText);
              },
            },
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
            commands.fullscreen,
          ]}
          value={value || ""}
          onChange={(newValue) => {
            onChange({ target: { name, value: newValue || "" } });
          }}
        />
        <div style={{ padding: "50px 0 0 0" }} />
        <MDEditor.Markdown source={value || ""} />
        <MediaLib
          isOpen={mediaLibVisible}
          onChange={handleChangeAssets}
          onToggle={handleToggleMediaLib}
        />
      </Wrapper>
      {error && (
        <Typography variant="pi" textColor="danger600">
          {formatMessage({ id: error, defaultMessage: error })}
        </Typography>
      )}
      {description && (
        <Typography variant="pi">{formatMessage(description)}</Typography>
      )}
    </Stack>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Editor;
