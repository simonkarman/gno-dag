import { createGlobalStyle } from 'styled-components';
import { paragraphFont, writingFont } from '../pages/_document';

export const tableColor = '#f4d69e';
export const paperColor = '#fffaf5';
export const darkPaperColor = '#cbcbcb';
export const textColor = '#040b35';
export const accentColor = '#41586d';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${tableColor};
    color: ${textColor};
    font-family: ${paragraphFont.name}, serif;
  }

  .paper {
    text-align: justify;
    position: relative;
    background: ${paperColor};
    width: 90%;
    max-width: 345px;
    margin: 0.5em auto;
    padding: 0 0.2em;
    display: flex;
  }

  .paper h1 {
    line-height: 1.5rem;
    padding: 0.3rem 0.3rem 0;
    font-size: 1.14em;
    cursor: default;
  }

  .paper h2 {
    line-height: 1.2rem;
    padding: 0rem 0.6rem 0;
    font-size: 0.75em;
    font-weight: 800;
    text-transform: uppercase;
    background-color: ${accentColor}dd;
    color: ${paperColor};
    cursor: default;
  }

  .paper h3 {
    line-height: 1rem;
    padding: 0rem 0.6rem 0;
    font-size: 0.65em;
    font-weight: 800;
    text-transform: uppercase;
    background-color: ${accentColor}aa;
    color: ${paperColor};
    cursor: default;
  }

  .buttonrow {
    display: flex;
    align-items: center;
    align-content: center;

    button {
      flex: 1;
      background-color: ${accentColor};
      color: ${paperColor};
      border-radius: 3px;
      border: none;
      margin: 1px;
      padding: 0.2rem;
      font-family: monospace;
    }

    .danger {
      background-color: red;
    }
  }

  .page {
    flex: 50%;
    border-radius: 3px;
    background-color: ${paperColor};
    padding-bottom: 0.5rem;

    /* Scrolling */
    overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .pageNumber {
    text-align: right;
  }

  .left {
    padding-left: 0.3em;
    border-right: 1px solid ${accentColor};
    background: linear-gradient(to right,transparent 95%,${darkPaperColor});
    background-repeat: no-repeat;
    p {
      padding: 0 1rem 0 0.4rem;
    }
    h2 {
      margin-right: -1px;
    }
    h3 {
      margin-right: -1px;
    }
  }

  .right {
    padding-right: 0.3em;
    border-left: 1px solid ${accentColor};
    background: linear-gradient(to left,transparent 95%,${darkPaperColor});
    background-repeat: no-repeat;

    p {
      padding: 0 0.4rem 0.5rem 1rem;
    }
    h2 {
      margin-left: -1px;
      padding-left: 1.3rem;
    }
    h3 {
      margin-left: -1px;
      padding-left: 1.6rem;
    }
    img {
      object-fit: cover;
      margin: 0 1.4em;
      width: 80%;
    }
    img.small {
      margin: 0.4rem 0.4rem 0.1rem 0.5rem;
      padding: 0.1rem;
      width: 2.3rem;
      float: left;
    }
    img.grid {
      margin: 0.3rem;
      padding: 0;
      width: 1.8rem;
    }
    strong {
      text-decoration: underline;
    }
  }

  .page p {
    margin: 0.2rem 0;
    line-height: 1rem;
    font-size: 0.75em;
    cursor: default;
  }

  .paragraph {
    background: linear-gradient(to bottom,transparent 0.95rem, ${darkPaperColor}33 0.05rem);
    background-size: 100% 1rem;
    
    .bold {
      font-weight: bold;
    }
  }
 
  .clickable {
    color: #00000033;
    text-decoration: underline;
  }

  .information {
    display: flex;

    .key {
      font-weight: bold;
      min-width: 30%;
      margin-right: 0.3rem;
    }

    .value {
      color: blue;
      font-family: ${writingFont.name}, cursive;
      padding: 0rem 0.2rem;
      border-bottom: 1px solid ${textColor}55;
      flex-grow: 1;
    }

    .strikethrough {
      color: red;
      text-decoration: line-through;
    }
  }

  .schedule {
    display: flex;
    align-items: flex-end;

    .time {
      font-size: 0.5rem;
      font-family: monospace;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .event {
      font-family: ${writingFont.name}, cursive;
      padding: 0rem 0.2rem;
      border-bottom: 1px solid ${textColor}55;
      flex-grow: 1;
    }

    .event.known {
      color: blue;
      cursor: pointer;
    }

    .event.unknown {
      color: ${textColor}3f;
      cursor: progress;
    }

    .event.selected {
      color: red;
    }
  }
`;
