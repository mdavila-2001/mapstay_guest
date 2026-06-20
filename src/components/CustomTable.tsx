import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { TYPOGRAPHY } from '../core/theme/theme';

export interface ColumnConfig<T> {
  readonly key: string;
  readonly title: string;
  readonly flex?: number;
  readonly width?: number;
  readonly align?: 'left' | 'center' | 'right';
  readonly render?: (item: T) => React.ReactNode;
}

export interface CustomTableProps<T> {
  readonly data: readonly T[];
  readonly columns: readonly ColumnConfig<T>[];
  readonly keyExtractor: (item: T) => string;
  readonly horizontalScroll?: boolean;
  readonly onRowPress?: (item: T) => void;
  readonly zebraStriped?: boolean;
  readonly emptyComponent?: React.ReactNode;
  readonly containerStyle?: StyleProp<ViewStyle>;
}

export function CustomTable<T>({
  data,
  columns,
  keyExtractor,
  horizontalScroll = false,
  onRowPress,
  zebraStriped = false,
  emptyComponent,
  containerStyle,
}: Readonly<CustomTableProps<T>>) {

  const getAlignmentStyle = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return {
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          textStyle: styles.textCenter,
        };
      case 'right':
        return {
          alignItems: 'flex-end' as const,
          justifyContent: 'flex-end' as const,
          textStyle: styles.textRight,
        };
      case 'left':
      default:
        return {
          alignItems: 'flex-start' as const,
          justifyContent: 'flex-start' as const,
          textStyle: styles.textLeft,
        };
    }
  };

  const getScrollColumnStyle = (column: ColumnConfig<T>): ViewStyle => {
    if (column.width !== undefined) {
      return { width: column.width };
    }
    return { width: column.flex ? column.flex * 120 : 100 };
  };

  const getFlexColumnStyle = (column: ColumnConfig<T>): ViewStyle => {
    if (column.width !== undefined) {
      return { width: column.width, flex: 0 };
    }
    return { flex: column.flex ?? 1 };
  };

  const getColumnStyle = horizontalScroll ? getScrollColumnStyle : getFlexColumnStyle;

  const renderScrollableTable = (body: React.ReactNode) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>{body}</View>
    </ScrollView>
  );

  const renderStaticTable = (body: React.ReactNode) => body;

  const renderTableWrapper = horizontalScroll ? renderScrollableTable : renderStaticTable;

  const renderHeader = () => {
    return (
      <View style={styles.headerRow}>
        {columns.map((col) => {
          const alignment = getAlignmentStyle(col.align);
          const colStyle = getColumnStyle(col);

          return (
            <View
              key={`header-${col.key}`}
              style={[styles.headerCell, colStyle, { alignItems: alignment.alignItems }]}
            >
              <Text style={[styles.headerText, alignment.textStyle]}>
                {col.title}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const getStringValue = (val: unknown): string => {
    if (val === null || val === undefined) {
      return '';
    }
    if (typeof val === 'string') {
      return val;
    }
    if (typeof val === 'number' || typeof val === 'boolean') {
      return val.toString();
    }
    if (val instanceof Date) {
      return val.toLocaleDateString();
    }
    return JSON.stringify(val);
  };

  const renderRow = (item: T, index: number) => {
    const isLastRow = index === data.length - 1;
    const isAlternate = zebraStriped && index % 2 === 1;
    const rowBg = isAlternate ? styles.rowAlternateBg : styles.rowDefaultBg;

    const rowContent = (
      <View style={[styles.rowContainer, rowBg, isLastRow && styles.noBottomBorder]}>
        {columns.map((col) => {
          const alignment = getAlignmentStyle(col.align);
          const colStyle = getColumnStyle(col);
          const value = item[col.key as keyof T];

          return (
            <View
              key={`cell-${col.key}-${keyExtractor(item)}`}
              style={[styles.cell, colStyle, { alignItems: alignment.alignItems }]}
            >
              {col.render ? (
                col.render(item)
              ) : (
                <Text
                  style={[styles.cellText, alignment.textStyle]}
                  numberOfLines={1}
                >
                  {getStringValue(value)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    );

    if (onRowPress) {
      return (
        <TouchableOpacity
          key={`row-${keyExtractor(item)}`}
          activeOpacity={0.7}
          onPress={() => onRowPress(item)}
        >
          {rowContent}
        </TouchableOpacity>
      );
    }

    return (
      <View key={`row-${keyExtractor(item)}`}>
        {rowContent}
      </View>
    );
  };

  const renderContent = () => {
    if (data.length === 0) {
      return emptyComponent || (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay datos disponibles</Text>
        </View>
      );
    }
    return data.map((item, index) => renderRow(item, index));
  };

  const tableBody = (
    <View style={styles.tableInnerContainer}>
      {renderHeader()}
      {renderContent()}
    </View>
  );

  return (
    <View style={[styles.tableOuterContainer, containerStyle]}>
      {renderTableWrapper(tableBody)}
    </View>
  );
}

const styles = StyleSheet.create({

  tableOuterContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    backgroundColor: '#0b1326',
  },
  tableInnerContainer: {
    width: '100%',
  },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#171f33',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    minHeight: 44,
    alignItems: 'center',
  },
  headerCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },

  headerText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    color: '#dae2fd',
  },

  rowContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    minHeight: 48,
    alignItems: 'center',
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },

  rowDefaultBg: {
    backgroundColor: '#0b1326',
  },
  rowAlternateBg: {
    backgroundColor: '#131b2e',
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  cellText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#c4c6cf',
  },

  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },

  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#94a3b8',
  },
});

