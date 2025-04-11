import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { NAVIGATION } from "@/shared/config/navigation";
import ToolbarActions from "@/widgets/toolbar/ToolbarActions";
import { Path } from "@phosphor-icons/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToolpadDashboardLayout
      navigation={NAVIGATION}
      slots={{
        toolbarActions: ToolbarActions,
      }}
      branding={{
        logo: <Path size={45} color="#fff" />,
        title: "Обходчик",
      }}
      sx={{
        "& .MuiAppBar-root": {
          backgroundColor: "#1976D2",
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
          color: "#ffffff",
        },
        "& .MuiToolbar-root": {
          padding: "0 24px",
          minHeight: 64,
        },
        "& .MuiTypography-h6": {
          fontSize: "1.5rem",
          fontWeight: 500,
          color: "#ffffff",
          marginLeft: "10px",
        },
        "& .MuiIconButton-root": {
          color: "#ffffff",
        },
      }}
    >
      {children}
    </ToolpadDashboardLayout>
  );
}
