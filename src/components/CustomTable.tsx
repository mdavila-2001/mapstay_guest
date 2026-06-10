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

  // Selección de estrategia de estilos para columnas basada en la configuración de scroll
  const getColumnStyle = horizontalScroll ? getScrollColumnStyle : getFlexColumnStyle;

  // Renderizadores de estructura de tabla según scrollable
  const renderScrollableTable = (body: React.ReactNode) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>{body}</View>
    </ScrollView>
  );

  const renderStaticTable = (body: React.ReactNode) => body;

  const renderTableWrapper = horizontalScroll ? renderScrollableTable : renderStaticTable;

  // Renderiza el encabezado de la tabla
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

  // Renderiza el contenido principal: datos o vista vacía
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
  // Contenedor principal de la tabla con bordes redondeados y recorte de filas
  tableOuterContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    overflow: 'hidden',
    backgroundColor: '#0b1326', // surface / background
  },
  tableInnerContainer: {
    width: '100%',
  },
  // Fila del encabezado (surface-container)
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
  // Textos de encabezado: fuente Inter, label-sm o label-md en negrita
  headerText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '700',
    color: '#dae2fd', // on-surface
  },
  // Contenedor de la fila de datos
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
  // Fondos alternados para las celdas
  rowDefaultBg: {
    backgroundColor: '#0b1326',
  },
  rowAlternateBg: {
    backgroundColor: '#131b2e', // surface-container-low (cebreado)
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  // Textos de celdas: fuente Inter, body-sm
  cellText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#c4c6cf', // on-surface-variant
  },
  // Alineaciones de texto
  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  // Estado vacío
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#94a3b8',
  },
});
