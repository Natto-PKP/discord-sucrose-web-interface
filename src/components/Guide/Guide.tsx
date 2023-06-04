import {
  FC, useState, useContext, useEffect,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import * as VariableContext from '../../contextes/VariableContext';
import translations from '../../translations';

import styles from './Guide.module.scss';

interface Guide {
  label: string;
  markdown: string;
  subs?: { label: string; markdown: string; }[];
}

// ! Faire style pour le markdown
// ! Peut être réduire arbo expand

export default (() => {
  const variables = useContext(VariableContext.Context);
  const translation = translations[variables.langs.selected as keyof typeof translations];

  const [arboExpand, setArboExpand] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Guide>(translation.guides[0]);
  const [markdownContent, setMarkdownContent] = useState<string>();

  useEffect(() => {
    if (selectedContent) {
      fetch(selectedContent.markdown)
        .then((res) => res.text())
        .then((txt) => setMarkdownContent(txt));
    }
  }, [selectedContent]);

  return (
    <main className={`flex-row ${styles.guide}`}>
      <div className="styles.contents">
        {markdownContent && (
          <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        )}
      </div>

      <div className={`flex-column ${styles.arbo} ${arboExpand ? styles['arbo-expanded'] : ''}`}>
        <div className={styles['arbo-toggle-button']}>
          <button className="icon-button" type="button" onClick={() => setArboExpand(!arboExpand)}>
            {!arboExpand ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        <div className={`${styles['arbo-content']}`}>
          {translation.guides.map((content) => (
            <>
              <button
                type="button"
                key={content.label}
                onClick={() => setSelectedContent(content)}
                className={`${styles['arbo-content-item']} ${content.label === selectedContent.label ? styles['arbo-content-item--activate'] : ''} flex-row flex-row--align white-text container--clickable container--hover container--round`}
              >
                {/* <ArrowRightIcon /> */}
                <span>{content.label}</span>
              </button>
              {content.subs?.length && (
                <ul className={styles['arbo-content-item-subs']}>
                  {content.subs.map((sub) => (
                    <li>
                      <button
                        type="button"
                        key={content.label}
                        onClick={() => setSelectedContent(sub)}
                        className={`${styles['arbo-content-item-subs-item']} ${sub.label === selectedContent.label ? styles['arbo-content-item-subs-item--activate'] : ''} flex-row flex-row--align white-text container--clickable container--hover container--round`}
                      >
                        <span>{sub.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ))}
        </div>
      </div>
    </main>
  );
}) as FC<{ }>;
