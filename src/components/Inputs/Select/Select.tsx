import {
  FC, useRef, useState, RefObject, useEffect, useContext, useCallback,
} from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import styles from './Select.module.scss';
import * as VariableContext from '../../../contextes/VariableContext';

export type Option = {
  label: string;
  value: string;
  icon?: JSX.Element | string | null;
  selected?: boolean | null;
};

type Props = {
  options: Option[];
  onChange?: (selected: Option) => void | Promise<void>;
  placeholder?: string
  maxHeight?: number;
  maxWidth?: number;
  width?: number;
  minWidth?: number;
  hideArrow?: boolean;
};

export default ((props: Props) => {
  // # contextes
  const variablesContext = useContext(VariableContext.Context);

  // # states
  const [toggleMenu, setToggleMenu] = useState(false);
  const [selected, setSelected] = useState<Option>();
  const [width, setWidth] = useState(0);
  const [y, setY] = useState(0);

  // # refs
  const selectRef = useRef<HTMLButtonElement>();
  const menuRef = useRef<HTMLDivElement>();

  // # statics
  const maxHeight = props.maxHeight || 100;

  // # update selected value
  const onChange = useCallback((option: Option) => {
    setSelected(option);
    setToggleMenu(false);
    if (props.onChange) props.onChange(option);
  }, [props]);

  // # set default selected value if exist
  const setDefaultSelectedOption = useCallback(() => {
    const hasSelected = props.options.find((o) => o.selected);
    if (!hasSelected) return;
    setSelected(hasSelected);
    if (props.onChange) props.onChange(hasSelected);
  }, [props]);

  // # set default selected value
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setDefaultSelectedOption(); }, []);

  // # update select width
  useEffect(() => { setWidth(selectRef.current?.clientWidth || 0); }, [toggleMenu, selected]);

  // # update menu position
  useEffect(() => {
    if (toggleMenu) {
      setY(() => {
        const selectBound = selectRef.current?.getBoundingClientRect();
        const menuBound = menuRef.current?.getBoundingClientRect();
        if (!selectBound || !menuBound) return 0;

        const menuHeight = menuBound.height;
        const selectHeight = selectBound.height;
        const windowHeigth = variablesContext.window.size.height;
        const isOut = selectBound.y + selectHeight + menuHeight >= windowHeigth;
        const value = isOut ? -menuHeight : selectHeight;
        return value;
      });
    }
  }, [variablesContext.window.size.height, toggleMenu]);

  return (
    <div
      className={styles.select}
      onMouseEnter={() => setToggleMenu(true)}
      onMouseLeave={() => setToggleMenu(false)}
    >
      <button
        className={styles.input}
        ref={selectRef as RefObject<HTMLButtonElement>}
        type="button"
        onClick={() => setToggleMenu(!toggleMenu)}
        style={{ minWidth: props.minWidth, maxWidth: props.maxWidth, width: props.width }}
      >
        {selected ? (
          <div className={styles.input__content}>
            <span className={styles.input__label}>{selected.label}</span>
            {selected.icon && <span className={styles.input__icon}>{selected.icon}</span>}
          </div>
        ) : (
          <div className={styles.input__content}>
            <span className={styles.input__label}>{props.placeholder || ' '}</span>
          </div>
        )}
        {!props.hideArrow && <ArrowLeftIcon />}
      </button>

      {toggleMenu && (
        <div
          className={styles.menu}
          style={{ maxHeight, width, top: y }}
          ref={menuRef as RefObject<HTMLDivElement>}
        >
            {props.options.map((option) => (
              <button
                type="button"
                className={styles.menu__item}
                onClick={() => onChange(option)}
                key={option.value}
              >
                <div className={styles.menu__item__content}>
                  <span className={styles.menu__item__label}>{option.label}</span>
                  {option.icon && <div className={styles.menu__item__icon}>{option.icon}</div>}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}) as FC<Props>;
