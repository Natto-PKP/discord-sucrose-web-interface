import {
  FC, useCallback, useContext, useState, useRef, MutableRefObject, useEffect,
} from 'react';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type Types from '../../typings';

import translations from '../../translations';
import * as VariableContext from '../../contextes/VariableContext';
import NewService from '../../services/NewService';

export default (() => {
  // # contextes
  const { langs, tags } = useContext(VariableContext.Context);
  const translation = translations[langs.selected as keyof typeof translations];

  // # ref
  const tableHeaderRef = useRef<HTMLDivElement>();

  // # states
  const [news, setNews] = useState<Types.New[]>();
  const [expandedItem, setExpandedItem] = useState<Types.New>();

  const handleExpandedItemClick = useCallback((n: Types.New) => {
    if (!n.file) return;
    NewService.getDetails(langs.selected, n.file)
      .then((details) => setExpandedItem({ ...n, details }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedItem]);

  useEffect(() => {
    NewService.getList(langs.selected).then((ns) => setNews(ns));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    NewService.getList(langs.selected).then((ns) => setNews(ns));
  }, [langs.selected]);

  return (
    <main className="container flex-column" style={{ height: '100%' }}>
      <div className="table" style={{ height: '100%' }}>
        {/* Table header */}
        <div ref={tableHeaderRef as MutableRefObject<HTMLDivElement>} className="container container--lite-padding table-header">
          <h2 className="label">{translation.dashboard.newTableHeaderTitle}</h2>
        </div>

        <div className="flex-column overflow--y overflow--scrollbar">
          {/* Table item */}
          {news && news.map((n) => (
            <button
              key={n.label}
              type="button"
              className="container container--clickable container--hover container--micro-padding flex-column flex-column--align"
              onClick={() => handleExpandedItemClick(n)}
            >
              <div className="flex-row flex-row--align flex--gap">
                <div className="icon-button">
                  {expandedItem && expandedItem.label === n.label
                    ? <ArrowDropUpIcon />
                    : <ArrowDropDownIcon />}
                </div>
                {n.type && <span className={`tag ${tags.colors[n.type]}`}>{n.type}</span>}
                <h3 className="white-text">{n.label}</h3>
              </div>

              {expandedItem && expandedItem.label === n.label && (
                <div className="container container--micro-padding details text white-text">{n.details}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}) as FC<{ }>;
