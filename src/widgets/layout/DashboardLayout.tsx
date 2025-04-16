import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { NAVIGATION } from "@/shared/config/navigation";
import ToolbarActions from "@/widgets/toolbar/ToolbarActions";
import { Path } from "@phosphor-icons/react";
import { useTheme } from "@mui/material";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <ToolpadDashboardLayout
      navigation={NAVIGATION}
      slots={{
        toolbarActions: ToolbarActions,
      }}
      branding={{
        logo: <Path size={45} color={theme.palette.primary.contrastText} />,
        title: "Обходчик",
      }}
      sx={{
        "& .MuiAppBar-root": {
          backgroundColor: theme.palette.primary.main,
          boxShadow: theme.shadows[3],
          color: theme.palette.primary.contrastText,
        },
        "& .MuiToolbar-root": {
          padding: theme.spacing(0, 3),
          minHeight: 64,
        },
        "& .MuiTypography-h6": {
          fontSize: theme.typography.h6.fontSize,
          fontWeight: theme.typography.h6.fontWeight,
          color: theme.palette.text.primary,
          marginLeft: theme.spacing(1.25),
        },
      }}
    >
      {children}
    </ToolpadDashboardLayout>
  );
}
