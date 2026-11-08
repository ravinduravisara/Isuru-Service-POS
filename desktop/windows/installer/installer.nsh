; ==============================================================================
; ISURU SERVICE CENTER POS: CUSTOM NSIS INSTALLER & DATA PROTECTION SCRIPT
; ==============================================================================

!include "LogicLib.nsh"
!include "FileFunc.nsh"

; Define common data directory: C:\ProgramData\ISURU Service POS
!define APP_DATA_DIR "$COMMONAPPDATA\ISURU Service POS"

; Hook executed after files are copied to Program Files
!macro customInstall
  DetailPrint "Configuring persistent local business data directory..."

  ; Create durable ProgramData subdirectories
  CreateDirectory "${APP_DATA_DIR}"
  CreateDirectory "${APP_DATA_DIR}\database"
  CreateDirectory "${APP_DATA_DIR}\uploads"
  CreateDirectory "${APP_DATA_DIR}\backups"
  CreateDirectory "${APP_DATA_DIR}\logs"
  CreateDirectory "${APP_DATA_DIR}\config"
  CreateDirectory "${APP_DATA_DIR}\sync"

  ; Grant read/write permissions to standard user accounts so service can run with least privileges
  AccessControl::GrantOnFile "${APP_DATA_DIR}" "(BU)" "FullAccess"

  DetailPrint "Local business data directory configured at: ${APP_DATA_DIR}"
!macroend

; Hook executed during uninstallation
; STRICT REQUIREMENT (RULE 20): Do NOT automatically delete business data during uninstall
!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION \
    "Do you want to retain your local invoice records, customer data, and database backups?$\n$\n(Recommended: Click YES to keep your historical data safe for future reinstallation)" \
    IDYES KeepData IDNO DeleteData

KeepData:
  DetailPrint "Preserving business data in: ${APP_DATA_DIR}"
  Goto EndUninstall

DeleteData:
  DetailPrint "Removing application data folder as requested..."
  RMDir /r "${APP_DATA_DIR}"

EndUninstall:
!macroend
