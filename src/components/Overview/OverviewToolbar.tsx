import * as React from 'react';
import {
  Button,
  ButtonVariant,
  FormSelect,
  FormSelectOption,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  TextInput,
  TextInputTypes,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import { ListIcon, SortAlphaDownIcon, SortAlphaUpIcon, ThLargeIcon, ThIcon } from '@patternfly/react-icons';
import {
  ActiveFilter,
  ActiveFiltersInfo,
  AllFilterTypes,
  NamespaceInfo,
  DEFAULT_LABEL_OPERATION,
  FILTER_ACTION_UPDATE,
  FilterType,
  SortField
} from '../../types/';
import { availableFilters, LabelFilters } from './OverviewToolbar/';
import { ToolbarDropdown } from '../ToolbarDropwdown/ToolbarDropdown';
import { TimeDurationComponent } from '../Time/TimeDurationComponent';
import * as Sorts from './Sorts';
import { style } from 'typestyle';
import { PFColors } from '../../components/Pf/PfColors';
import { ComputedServerConfig } from '../../config';

export enum OverviewDisplayMode {
  COMPACT,
  EXPAND,
  LIST
}

const overviewTypes = {
  app: 'Apps',
  workload: 'Workloads',
  service: 'Services'
};

const directionTypes = {
  inbound: 'Inbound',
  outbound: 'Outbound'
};

// TODO Use Object.fromEntries when available

const sortTypes = (function () {
  let o = {};
  Sorts.sortFields.forEach(sortType => {
    let id: string = sortType.id;
    Object.assign(o, { [id]: sortType.title });
  });
  return o;
})();

const containerPadding = style({
  backgroundColor: PFColors.White,
  padding: '0px 20px 0px 20px'
});

const containerFlex = style({
  display: 'flex',
  flexWrap: 'wrap'
});

const filterToolbarStyle = style({
  paddingTop: '10px'
});

const rightToolbarStyle = style({
  marginLeft: 'auto',
  height: '118px',
  padding: '10px 0px 0px 0px'
});

const timeToolbarStyle = style({
  textAlign: 'right'
});

const actionsToolbarStyle = style({
  paddingTop: '17px'
});

const typeSelectStyle = style({
  paddingRight: '6px'
});

export type OverviewType = keyof typeof overviewTypes;

export type DirectionType = keyof typeof directionTypes;

const toolbarStyle = style({
  padding: 0,
  rowGap: 'var(--pf-global--spacer--md)',
  $nest: {
    '& > .pf-c-toolbar__content': {
      paddingLeft: 0
    }
  }
});

type Props = {
  displayMode: OverviewDisplayMode;
  setDisplayMode: (mode: OverviewDisplayMode) => void;
  overviewType: OverviewType;
  setOverviewType: (overviewType: OverviewType) => void;
  duration: number;
  setDuration: (duration: number) => void;
  direction: DirectionType;
  setDirection: (direction: DirectionType) => void;
  onFilterChange: (active: ActiveFiltersInfo) => void;
  onRefresh: () => void;
  sort: (sortField: SortField<NamespaceInfo>, isAscending: boolean) => void;
  sortField: SortField<NamespaceInfo>;
  isSortAscending: boolean;
  updateSortDirection: (isSortAscending: boolean) => void;
  config: ComputedServerConfig;
  listView?: boolean;
};

export const OverviewToolbar = (props: Props) => {
  const [currentFilterType, setCurrentFilterType] = React.useState<FilterType>(availableFilters[0]);
  const [activeFilters, setActiveFilters] = React.useState<ActiveFiltersInfo>({ filters: [], op: 'or' });
  const [filterTypes, _] = React.useState<FilterType[]>(availableFilters);
  const [currentValue, setCurrentValue] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const removeFilter = (category: string | any, value: string | any) => {
    const updated = activeFilters.filters.filter(x => x.category !== category || x.value !== value);
    if (updated.length !== activeFilters.filters.length) {
      setActiveFilters({ filters: updated, op: activeFilters.op });
      props.onFilterChange({ filters: updated, op: activeFilters.op });
      props.onRefresh();
    }
  };

  const selectFilterType = (value: string) => {
    const filterType = filterTypes.filter(filter => filter.category === value)[0];
    if (currentFilterType !== filterType) {
      setCurrentFilterType(filterType);
      setCurrentValue('');
    }
  };

  const isActive = (type: FilterType, value: string): boolean => {
    return activeFilters.filters.some(active => value === active.value && type.category === active.category);
  };

  const filterAdded = (field: FilterType, value: string) => {
    const activeFilter: ActiveFilter = {
      category: field.category,
      value: value
    };

    // For filters that need to be updated in place instead of added, we check if it is already defined in activeFilters
    const current = activeFilters.filters.filter(filter => filter.category === field.category);
    if (field.action === FILTER_ACTION_UPDATE && current.length > 0) {
      current.forEach(filter => (filter.value = value));
    } else {
      activeFilters.filters.push(activeFilter);
    }

    updateActiveFilters(activeFilters);
  };

  const updateActiveFilters = (activeFilters: ActiveFiltersInfo) => {
    const cleanFilters: ActiveFilter[] = [];
    activeFilters.filters.forEach(activeFilter => {
      const filterType = filterTypes.find(filter => filter.category === activeFilter.category);
      if (!filterType) {
        return;
      }
      cleanFilters.push(activeFilter);
    });
    setActiveFilters({ filters: cleanFilters, op: DEFAULT_LABEL_OPERATION });
    setCurrentValue('');
    props.onFilterChange({ filters: cleanFilters, op: DEFAULT_LABEL_OPERATION });
  };

  const filterValueAheadSelected = (_event: any, valueId: string | SelectOptionObject) => {
    filterValueSelected(valueId);
    setIsOpen(false);
  };

  const filterValueSelected = (valueId: string | SelectOptionObject) => {
    const filterValue = currentFilterType.filterValues.find(filter => filter.id === valueId);

    if (filterValue && filterValue.id !== currentValue && !isActive(currentFilterType, filterValue.title)) {
      filterAdded(currentFilterType, filterValue.title);
    }
  };

  const updateCurrentValue = value => {
    setCurrentValue(value);
  };

  const onValueKeyPress = (keyEvent: any) => {
    if (keyEvent.key === 'Enter') {
      if (currentValue && currentValue.length > 0 && !isActive(currentFilterType, currentValue)) {
        filterAdded(currentFilterType, currentValue);
      }
      setCurrentValue('');
      keyEvent.stopPropagation();
      keyEvent.preventDefault();
    }
  };

  const renderInput = () => {
    if (!currentFilterType) {
      return null;
    }
    if (currentFilterType.filterType === AllFilterTypes.typeAhead) {
      return (
        <Select
          value="default"
          onSelect={filterValueAheadSelected}
          onToggle={isOpen => setIsOpen(isOpen)}
          variant={SelectVariant.typeahead}
          isOpen={isOpen}
          aria-label="filter_select_value"
          placeholderText={currentFilterType.placeholder}
          width="auto"
          data-test="istio-type-dropdown"
        >
          {currentFilterType.filterValues.map((filter, index) => (
            <SelectOption key={'filter_' + index} value={filter.id} label={filter.title} />
          ))}
        </Select>
      );
    } else if (currentFilterType.filterType === AllFilterTypes.select) {
      return (
        <FormSelect
          value="default"
          onChange={filterValueSelected}
          aria-label="filter_select_value"
          style={{ width: 'auto' }}
        >
          <FormSelectOption key={'filter_default'} value={'default'} label={currentFilterType.placeholder} />
          {currentFilterType.filterValues.map((filter, index) => (
            <FormSelectOption key={'filter_' + index} value={filter.id} label={filter.title} />
          ))}
        </FormSelect>
      );
    } else if (
      currentFilterType.filterType === AllFilterTypes.label ||
      currentFilterType.filterType === AllFilterTypes.nsLabel
    ) {
      return (
        <LabelFilters
          value={currentValue}
          onChange={updateCurrentValue}
          filterAdd={value => filterAdded(currentFilterType, value)}
          isActive={value => isActive(currentFilterType, value)}
        />
      );
    } else {
      return (
        <TextInput
          type={currentFilterType.filterType as TextInputTypes}
          value={currentValue}
          aria-label="filter_input_value"
          placeholder={currentFilterType.placeholder}
          onChange={updateCurrentValue}
          onKeyPress={e => onValueKeyPress(e)}
          style={{ width: 'auto' }}
        />
      );
    }
  };

  const updateOverviewType = (otype: String) => {
    const isOverviewType = (val: String): val is OverviewType =>
      val === 'app' || val === 'workload' || val === 'service';
    if (isOverviewType(otype)) {
      props.setOverviewType(otype);
    } else {
      throw new Error('Overview type is not valid.');
    }
  };

  const updateDirectionType = (dtype: String) => {
    const isDirectionType = (val: String): val is DirectionType => val === 'inbound' || val === 'outbound';

    if (isDirectionType(dtype)) {
      props.setDirection(dtype);
    } else {
      throw new Error('Direction type is not valid.');
    }
  };

  const changeSortField = value => {
    const sortField: SortField<NamespaceInfo> = Sorts.sortFields.filter(sort => sort.id === value)[0];
    props.sort(sortField, props.isSortAscending);
  };

  const filterOptions = filterTypes.map(option => (
    <FormSelectOption key={option.category} value={option.category} label={option.category} />
  ));

  const filterToolbar = (
    <Toolbar id="filter-selection" className={toolbarStyle}>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          {availableFilters.map((ft, i) => {
            return (
              <ToolbarFilter
                key={`toolbar_filter-${ft.category}`}
                chips={activeFilters.filters.filter(af => af.category === ft.category).map(af => af.value)}
                deleteChip={removeFilter}
                categoryName={ft.category}
              >
                {i === 0 && (
                  <FormSelect
                    value={currentFilterType.category}
                    aria-label="filter_select_type"
                    onChange={selectFilterType}
                    style={{ width: 'auto', backgroundColor: '#ededed', borderColor: '#bbb' }}
                  >
                    {filterOptions}
                  </FormSelect>
                )}
                {i === 0 && renderInput()}
              </ToolbarFilter>
            );
          })}
        </ToolbarGroup>
        {props.displayMode !== OverviewDisplayMode.LIST && (
          <>
            <ToolbarDropdown
              id="sort_selector"
              handleSelect={changeSortField}
              value={props.sortField.id}
              label={sortTypes[props.overviewType]}
              options={sortTypes}
              data-sort-field={props.sortField.id}
            />
            <Button
              variant={ButtonVariant.plain}
              onClick={() => props.updateSortDirection(!props.isSortAscending)}
              style={{ paddingLeft: '10px', paddingRight: '10px' }}
              data-sort-asc={props.isSortAscending}
            >
              {props.isSortAscending ? <SortAlphaDownIcon /> : <SortAlphaUpIcon />}
            </Button>
          </>
        )}
      </ToolbarContent>
    </Toolbar>
  );

  const timeToolbar = (
    <div className={timeToolbarStyle}>
      <TimeDurationComponent
        key="overview-time-range"
        id="overview-time-range"
        disabled={false}
        duration={props.duration}
        setDuration={props.setDuration}
        serverConfig={props.config}
      />
    </div>
  );

  const actionsToolbar = (
    <div className={actionsToolbarStyle}>
      <ToolbarDropdown
        id="overview-type"
        disabled={false}
        classNameSelect={typeSelectStyle}
        handleSelect={updateOverviewType}
        nameDropdown="Health for"
        value={props.overviewType}
        label={overviewTypes[props.overviewType]}
        options={overviewTypes}
      />
      {props.displayMode !== OverviewDisplayMode.COMPACT && (
        <ToolbarDropdown
          id="direction-type"
          disabled={false}
          handleSelect={updateDirectionType}
          nameDropdown="Traffic"
          value={props.direction}
          label={directionTypes[props.direction]}
          options={directionTypes}
        />
      )}
      <Tooltip content={<>Expand view</>} position={TooltipPosition.top}>
        <Button
          onClick={() => props.setDisplayMode(OverviewDisplayMode.EXPAND)}
          variant={ButtonVariant.plain}
          isActive={props.displayMode === OverviewDisplayMode.EXPAND}
          style={{ padding: '0 4px 0 16px' }}
          data-test={'overview-type-' + OverviewDisplayMode[OverviewDisplayMode.EXPAND]}
        >
          <ThLargeIcon />
        </Button>
      </Tooltip>
      <Tooltip content={<>Compact view</>} position={TooltipPosition.top}>
        <Button
          onClick={() => props.setDisplayMode(OverviewDisplayMode.COMPACT)}
          variant={ButtonVariant.plain}
          isActive={props.displayMode === OverviewDisplayMode.COMPACT}
          style={{ padding: '0 4px 0 4px' }}
          data-test={'overview-type-' + OverviewDisplayMode[OverviewDisplayMode.COMPACT]}
        >
          <ThIcon />
        </Button>
      </Tooltip>
      {props.listView && (
        <Tooltip content={<>List view</>} position={TooltipPosition.top}>
          <Button
            onClick={() => props.setDisplayMode(OverviewDisplayMode.LIST)}
            variant={ButtonVariant.plain}
            isActive={props.displayMode === OverviewDisplayMode.LIST}
            style={{ padding: '0 4px 0 4px' }}
            data-test={'overview-type-' + OverviewDisplayMode[OverviewDisplayMode.LIST]}
          >
            <ListIcon />
          </Button>
        </Tooltip>
      )}
    </div>
  );

  return (
    <div className={containerPadding}>
      <div className={containerFlex}>
        <div className={filterToolbarStyle}>{filterToolbar}</div>
        <div className={rightToolbarStyle}>
          {timeToolbar}
          {actionsToolbar}
        </div>
      </div>
    </div>
  );
};
