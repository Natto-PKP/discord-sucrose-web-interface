import {
  forwardRef, useState, useRef, MutableRefObject, useEffect, useCallback, useContext,
} from 'react';
import { Link, useLocation } from 'react-router-dom';

import LaunchIcon from '@mui/icons-material/Launch';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import GitHubIcon from '@mui/icons-material/GitHub';
import DownloadIcon from '@mui/icons-material/Download';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import * as VariableContext from '../../contextes/VariableContext';
import translations from '../../translations';

import styles from './Navigation.module.scss';
import Select, { Option as SelectOption } from '../Inputs/Select/Select';

export default forwardRef<HTMLElement>((_props, ref) => {
  const location = useLocation();

  // # contextes
  const variables = useContext(VariableContext.Context);
  const translation = translations[variables.langs.selected as keyof typeof translations];

  // # states
  const [burgerMenuActivate, setBurgerMenuActivate] = useState(false);
  const [titleHeight, setTitleHeight] = useState(0);
  const [navRetracted, setNavRetracted] = useState(false);

  // # refs
  const titleContainerRef = useRef<HTMLHeadingElement>() as MutableRefObject<HTMLHeadingElement>;

  // #
  const updateSizeValues = useCallback((ms: number) => {
    const interval = setInterval(() => {
      variables.navigation.update();
      variables.main.update();
      variables.mainBanner.update();
    }, 10);

    setTimeout(() => clearInterval(interval), ms);
  }, [variables]);

  // # on langue update
  const onLangChange = useCallback((option: SelectOption) => {
    variables.langs.setSelected(option.value);
  }, [variables.langs]);

  // # handle burger button
  const handleBurgerMenuButton = useCallback(() => {
    setBurgerMenuActivate(!burgerMenuActivate);
    updateSizeValues(5 * 100);
  }, [burgerMenuActivate, updateSizeValues]);

  // # handler expand button
  const handleExpandButton = useCallback(() => {
    setNavRetracted(!navRetracted);
    updateSizeValues(3 * 100);
  }, [navRetracted, updateSizeValues]);

  // # define title content height
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTitleHeight(titleContainerRef.current?.clientHeight || 0);
  }, [titleContainerRef.current?.clientHeight]);

  return (
    <header ref={ref} className={`${styles.header} ${navRetracted ? styles['header--retracted'] : ''}`}>
      {/* Title */}
      <h1
        ref={titleContainerRef}
        className={navRetracted ? styles.title : `${styles.title} ${styles.retract__nav}`}
      >
        <div className={styles.title__content}>
          <button
            className={`${styles.burger_menu} icon-button`}
            onClick={handleBurgerMenuButton}
            type="button"
          >
            <MenuIcon />
          </button>
          <span className={`${styles.title__label} ${styles.retractable}`}>
            discord-
            <span className={styles.title__label__accent}>sucrose</span>
          </span>
          <button
            className={`${styles.expand} icon-button`}
            onClick={handleExpandButton}
            type="button"
          >
            {!navRetracted ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        {/* Divider */}
        <div className={styles.divider} />
      </h1>

      {/* Menu */}
      <div
        style={{
          maxHeight: `calc(100% - ${titleHeight}px)`,
          height: burgerMenuActivate ? '100%' : '0%',
        }}
        className={styles.content}
      >
        <div className={styles.primary_box}>
          <ul className={styles.nav}>
            <li className={styles.nav__item}>
              <Link to="/" className={location.pathname === '/' ? styles['link--activate'] : ''}>
                <DashboardIcon />
                <span className={styles.retractable}>{translation.navigation.dashboard}</span>
              </Link>
            </li>
            <li className={styles.nav__item}>
              <Link to="/guides" className={location.pathname.startsWith('/guides') ? styles['link--activate'] : ''}>
                <HelpCenterIcon />
                <span className={styles.retractable}>{translation.navigation.guide}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.secondary_box}>
          <ul className={styles.nav}>
            <li className={styles.nav__item}>
              <a href="https://github.com/Natto-PKP/discord-sucrose" target="_blank" rel="noreferrer">
                <GitHubIcon />
                <div className={`${styles.nav__item__label} ${styles.retractable}`}>
                  <span>{translation.navigation.github}</span>
                  <LaunchIcon />
                </div>
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="https://www.npmjs.com/package/discord-sucrose" target="_blank" rel="noreferrer">
                <DownloadIcon />
                <div className={`${styles.nav__item__label} ${styles.retractable}`}>
                  <span>{translation.navigation.npm}</span>
                  <LaunchIcon />
                </div>
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="https://discord.gg/FjvVHSRdq5" target="_blank" rel="noreferrer">
                <ContactSupportIcon />
                <div className={`${styles.nav__item__label} ${styles.retractable}`}>
                  <span>{translation.navigation.supportDiscordServer}</span>
                  <LaunchIcon />
                </div>
              </a>
            </li>
          </ul>

          {/* Details */}
          <div
            className={styles.details}
          >
            <span className={`${variables.langs.list.find((f) => f.value === variables.langs.selected)?.flag || ''} ${styles.details__flag}`} />
            <span className={`${styles.copyright} ${styles.retractable}`}>@copyright 2023</span>
            <div className={styles.retractable}>
              <Select
                minWidth={100}
                onChange={onLangChange}
                hideArrow
                options={variables.langs.list.map((lang) => ({
                  label: lang.label,
                  value: lang.value,
                  icon: <span className={lang.flag} />,
                  selected: variables.langs.selected === lang.value,
                }))}
              />
            </div>
          </div>
        </div>
      </div>

    </header>
  );
});
