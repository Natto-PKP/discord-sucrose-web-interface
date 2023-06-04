import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import {
  useRef, useState, useEffect, useCallback,
} from 'react';
import type { FC, MutableRefObject } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import type Types from '../typings';

import * as VariableContext from '../contextes/VariableContext';
import translations from '../translations';

import '../styles/core.scss';
import './App.scss';
import Navigation from './Navigation/Navigation';
import Dashboard from './Dashboard/Dashboard';
import Guide from './Guide/Guide';
import Query, { SizeType } from '../utils/Query';
import Element from '../utils/Element';

export default (() => {
  const { defaultSizeValue, defaultPositionValue } = VariableContext;
  // # states
  const [lang, setLang] = useState(localStorage.getItem('lang') || VariableContext.defaultLang);
  const [windowType, setWindowType] = useState<SizeType>('mobile');
  const [windowSize, setWindowSize] = useState<Types.SizeValue>(defaultSizeValue);
  const [navigationSize, setNavigationSize] = useState<Types.SizeValue>(defaultSizeValue);
  const [navigationPos, setNavigationPos] = useState<Types.PositionValue>(defaultPositionValue);
  const [mainBannerSize, setMainBannerSize] = useState<Types.SizeValue>(defaultSizeValue);
  const [mainBannerPos, setMainBannerPos] = useState<Types.PositionValue>(defaultPositionValue);
  const [mainSize, setMainSize] = useState<Types.SizeValue>(defaultSizeValue);
  const [mainPos, setMainPos] = useState<Types.PositionValue>(defaultPositionValue);

  // # refs
  const navigationRef = useRef<HTMLElement>();
  const mainBannerRef = useRef<HTMLDivElement>();
  const mainRef = useRef<HTMLDivElement>();

  // # define updater
  const updateWindowVariable = useCallback(() => {
    setWindowSize(Element.getSize());
    setWindowType(Query.getCurrentSize());
  }, []);

  const updateNavitationVariable = useCallback(() => {
    setNavigationSize(Element.getSize(navigationRef));
    setNavigationPos(Element.getPosition(navigationRef));
  }, []);

  const updateMainBannerVariable = useCallback(() => {
    setMainBannerSize(Element.getSize(mainBannerRef));
    setMainBannerPos(Element.getPosition(mainBannerRef));
  }, []);

  const updateMainVariable = useCallback(() => {
    setMainSize(Element.getSize(mainRef));
    setMainPos(Element.getPosition(mainRef));
  }, []);

  // # context variables value
  const variables = {
    langs: { list: VariableContext.langs, selected: lang, setSelected: setLang },
    tags: { colors: VariableContext.defaultTagColors },
    window: { size: windowSize, type: windowType, update: updateWindowVariable },
    navigation: { size: navigationSize, position: navigationPos, update: updateNavitationVariable },
    mainBanner: { size: mainBannerSize, position: mainBannerPos, update: updateMainBannerVariable },
    main: { size: mainSize, position: mainPos, update: updateMainVariable },
  } as typeof VariableContext.defaultVariableValue;

  // # update saved lang
  useEffect(() => {
    localStorage.setItem('lang', variables.langs.selected);
  }, [variables.langs.selected]);

  // # exec on load
  useEffect(() => {
    // # define window & navigation variables
    updateWindowVariable();
    updateNavitationVariable();
    updateMainBannerVariable();
    updateMainVariable();
    window.addEventListener('resize', () => {
      updateWindowVariable();
      updateNavitationVariable();
      updateMainBannerVariable();
      updateMainVariable();
    });

    // # define selected lang
    const savedLangOption = variables.langs.list.find((l) => l.value === variables.langs.selected);
    const value = savedLangOption?.value || VariableContext.defaultLang;
    setLang(value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translation = translations[lang as keyof typeof translations];

  return (
    <BrowserRouter>
      <VariableContext.Context.Provider value={variables}>
        <div className="body">
          <Navigation ref={navigationRef as MutableRefObject<HTMLElement>} />

          <div
            className="main"
            ref={mainRef as MutableRefObject<HTMLDivElement>}
            style={{ height: windowType === 'mobile' ? `calc(100vh - ${navigationSize.height}px)` : '100vh' }}
          >
            <div
              ref={mainBannerRef as MutableRefObject<HTMLDivElement>}
              className="main__banner container container--lite-padding"
            >
              <a
                className="link flex-row flex-row--align flex--gap container--clickable container--hover container container--round container--lite-padding container--info"
                href="https://docs.discord.sucrose.xyz"
                target="_blank"
                rel="noreferrer"
              >
                <LaunchIcon className="white-text" />
                {translation.fullDocumentationRedirection}
              </a>
            </div>

            <div style={{ height: windowType === 'mobile' ? `calc(100vh - ${navigationSize.height + mainBannerSize.height}px)` : `calc(100vh - ${mainBannerSize.height}px)` }}>
              <Routes>
                <Route index path="/" element={<Dashboard />} />
                <Route path="/guides" element={<Guide />} />
              </Routes>
            </div>
          </div>
        </div>
      </VariableContext.Context.Provider>
    </BrowserRouter>
  );
}) as FC<{}>;
